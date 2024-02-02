// https://www.i18next.com/misc/creating-own-plugins#backend
export const defaultOpts = {
  collectionName: 'i18n',
  languageFieldName: 'lang',
  namespaceFieldName: 'ns',
  dataFieldName: 'data',
  // eslint-disable-next-line no-console
  readOnError: console.error,
  // eslint-disable-next-line no-console
  readMultiOnError: console.error,
  // eslint-disable-next-line no-console
  createOnError: console.error,
};

export class Backend {
  /**
   * @param {*} services `i18next.services`
   * @param {object} backendOptions Backend Options
   * @param {Firestore} i18nextOptions.backend.firestore Firestore instance, already initialized and connected
   * @param {{isNamespaced?: boolean, collection?: function, query?: function, where?: function, getDocs?: function}} i18nextOptions.backend.firestoreModule identifies if given Firestore is modular, and if so provides the necessary modular functions
   * @param {string} [i18nextOptions.backend.collectionName='i18n'] Collection name for storing i18next data
   * @param {string} [i18nextOptions.backend.languageFieldName="lang"] Field name for language attribute
   * @param {string} [i18nextOptions.backend.namespaceFieldName="ns"] Field name for namespace attribute
   * @param {string} [i18nextOptions.backend.dataFieldName="data"] Field name for data attribute
   * @param {function} [i18nextOptions.backend.readOnError] Error handler for `read` process
   * @param {function} [i18nextOptions.backend.readMultiOnError] Error handler for `readMulti` process
   * @param {function} [i18nextOptions.backend.createOnError] Error handler for `create` process
   */
  constructor(services, backendOptions = {}, i18nextOptions = {}) {
    this.services = services;
    this.opts = backendOptions;
    this.i18nOpts = i18nextOptions;
    this.MODNAME = 'i18next-node-firestore-backend';

    this.init(services, backendOptions, i18nextOptions);
  }

  init(services, opts, i18nOpts) {
    this.services = services;
    this.i18nOpts = i18nOpts;
    this.opts = { ...defaultOpts, ...this.opts, ...opts };

    if (i18nOpts && i18nOpts.backend) {
      let bOpts = i18nOpts.backend;

      this.debug = bOpts.debug;

      if (this.debug) {
        console.log(`${this.MODNAME}:: options: ${JSON.stringify(bOpts)}`);
      }

      this.firestore = bOpts.firestore;
      this.firestoreModule = bOpts.firestoreModule;

      if (!this.firestore) {
        throw new Error(`${this.MODNAME}:: is null or undefined`);
      }

      if (
        this.firestoreModule?.useNamespace ||
        !this.firestoreModule?.collection ||
        typeof this.firestoreModule.collection !== 'function'
      ) {
        this.firestoreIsNamespaced = true;
      }

      if (this.debug) {
        if (this.firestoreIsNamespaced) {
          console.log(`${this.MODNAME}:: using namespaced Firestore`);
        } else {
          console.log(
            `${this.MODNAME}:: using modular Firestore:`,
            this.firestoreModule
          );
        }
      }

      if (bOpts.collectionName) {
        this.opts.collectionName = bOpts.collectionName;
      }
      if (bOpts.languageFieldName) {
        this.opts.languageFieldName = bOpts.languageFieldName;
      }
      if (bOpts.namespaceFieldName) {
        this.opts.namespaceFieldName = bOpts.namespaceFieldName;
      }
      if (bOpts.dataFieldName) {
        this.opts.dataFieldName = bOpts.dataFieldName;
      }

      if (this.debug) {
        console.log(
          `${this.MODNAME}:: this.opts: ${JSON.stringify(this.opts)}`
        );
      }
    }
  }

  /**
   * @param {string} lang the language code (e.g. "tr" or "en")
   * @param {string} ns the namespace code (e.g. "colors", "greetings")
   * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
   */
  async getDataFromNamedspacedFirestore(lang, ns) {
    const collRef = this.firestore.collection(this.opts.collectionName);
    const q = collRef
      .where(this.opts.languageFieldName, '==', lang)
      .where(this.opts.namespaceFieldName, '==', ns);

    const querySnap = await q.get();

    if (this.debug) {
      console.log(
        `${this.MODNAME}:: (${this.opts.collectionName}) querySnap.size: ${querySnap.size}`
      );
    }
    if (querySnap.empty) {
      return null;
    }

    if (querySnap.size > 1) {
      console.warn(
        `${this.MODNAME}: Found ${querySnap.size} docs for namespace ${ns}`
      );
    }

    const data = querySnap.docs[0].data();

    if (this.debug) {
      console.log(`${this.MODNAME}:: collection data:`, data);
    }

    return data;
  }

  /**
   * @param {string} lang the language code (e.g. "tr" or "en")
   * @param {string} ns the namespace code (e.g. "colors", "greetings")
   * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
   */
  async getDataFromModularFirestore(lang, ns) {
    const collRef = this.firestoreModule.collection(
      this.firestore,
      this.opts.collectionName
    );
    const q = this.firestoreModule.query(
      collRef,
      this.firestoreModule.where(this.opts.languageFieldName, '==', lang),
      this.firestoreModule.where(this.opts.namespaceFieldName, '==', ns)
    );

    const querySnap = await this.firestoreModule.getDocs(q);
    if (this.debug) {
      console.log(
        `${this.MODNAME}:: (${this.opts.collectionName}) querySnap.size: ${querySnap.size}`
      );
    }
    if (querySnap.empty) {
      return null;
    }

    if (querySnap.size > 1) {
      console.warn(
        `${this.MODNAME}: Found ${querySnap.size} docs for namespace ${ns}`
      );
    }

    const data = querySnap.docs[0].data();

    if (this.debug) {
      console.log(`${this.MODNAME}:: collection data:`, data);
    }

    return data;
  }

  /**
   * @param {string} lang the language code (e.g. "tr" or "en")
   * @param {string} ns the namespace code (e.g. "colors", "greetings")
   * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
   */
  async getLanguageAndNamespace(lang, ns) {
    if (
      !this.firestore ||
      !this.opts.collectionName ||
      !this.opts.languageFieldName ||
      !this.opts.namespaceFieldName
    ) {
      return null;
    }

    let data;
    if (this.firestoreIsNamespaced) {
      data = this.getDataFromNamedspacedFirestore(lang, ns);
    } else {
      data = this.getDataFromModularFirestore(lang, ns);
    }
    return data;
  }

  /**
   *
   * @param {string[]} langs array of languages
   * @param {string[]} nss array of namespaces
   * @returns {Promise<{[lang: string]: {[ns: string]: {data: {[code: string]: string}, language: string, namespace: string}}}>
   */
  async getLanguagesAndNamespaces(langs, nss) {
    let res = {};
    for (let i = 0; i < langs.length; i++) {
      for (let j = 0; j < nss.length; j++) {
        if (!res[langs[i]]) {
          res[langs[i]] = {};
        }
        res[langs[i]][nss[j]] = await this.getLanguageAndNamespace(
          langs[i],
          nss[j]
        );
      }
    }
    return res;
  }

  read(lang, ns, cb) {
    if (!cb) return;

    return this.getLanguageAndNamespace(lang, ns)
      .then((doc) => {
        if (!doc && this.debug) {
          console.log(
            `${this.MODNAME}: Failed to find data for lang(${lang}), ns(${ns})`
          );
        }
        cb(null, (doc && doc[this.opts.dataFieldName]) || {});
      })
      .catch((ex) => {
        this.opts.readOnError(ex);
      });
  }

  readMulti(langs, nss, cb) {
    if (!cb) return;

    let x = 'NOT IMPLEMENTED YET';
    if (x === 'NOT IMPLEMENTED YET') {
      console.error(x);
      return;
    }
  }

  create(langs, ns, key, fallbackVal, cb) {
    let x = 'NOT IMPLEMENTED YET';
    if (x === 'NOT IMPLEMENTED YET') {
      console.error(x);
      return;
    }
  }
}

// https://www.i18next.com/misc/creating-own-plugins#make-sure-to-set-the-plugin-type
Backend.type = 'backend';

export default Backend;
