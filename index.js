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
   * @param {object} i18nextOptions.backend.firestoreModule object from: `import * as FIRESTORE_MODULE from 'firebase/firestore';`
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
        console.log(`Firestore Backend options: ${JSON.stringify(bOpts)}`);
      }

      this.firestore = bOpts.firestore;
      this.firestoreModule = bOpts.firestoreModule;

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
    }
  }

  async getLanguageAndNamespace(lang, ns) {
    if (
      !this.firestore ||
      !this.opts.collectionName ||
      !this.opts.languageFieldName ||
      !this.opts.namespaceFieldName
    ) {
      return null;
    }

    let collRef = this.firestoreModule.collection(this.firestore, this.opts.collectionName);
    let q = this.firestoreModule.query(
      collRef,
      this.firestoreModule.where(this.opts.languageFieldName, '==', lang),
      this.firestoreModule.where(this.opts.namespaceFieldName, '==', ns)
    );

    let querySnap = await this.firestoreModule.getDocs(q);
    if (querySnap.empty) {
      return null;
    }

    if (querySnap.size > 1) {
      console.warn(
        `${this.MODNAME}: Found ${querySnap.size} docs for namespace ${ns}`
      );
    }

    let data = querySnap.docs[0].data();

    return data;
  }

  async getLanguagesAndNamespaces(langs, nss) {
    let res = {};
    for (let i = 0; i < langs.length; i++) {
      for (let j = 0; j < nss.length; j++) {
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
