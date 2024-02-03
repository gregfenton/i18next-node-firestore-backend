// https://www.i18next.com/misc/creating-own-plugins#backend
export const defaultOpts = {
  collectionName: 'i18n',
  languageFieldName: 'lang',
  namespaceFieldName: 'ns',
  dataFieldName: 'data',
  readOnError: console.error,
  readMultiOnError: console.error,
  createOnError: console.error,
};

type I18NFirestoreBackendModuleFuncs = {
  /**
   * the `collection` function from the modular Firestore SDK
   */
  collection: Function;
  /**
   * the `query` function from the modular Firestore SDK
   */
  query: Function;
  /**
   * the `where` function from the modular Firestore SDK
   */
  where: Function;
  /**
   * the `getDocs` function from the modular Firestore SDK
   */
  getDocs: Function;
};

type I18NFirestoreBackendModuleOpts = {
  /**
   * identifies if given `firestore` parameter is modular or namespaced
   */
  isModular: boolean;
  /**
   * if `firestore` is modular, provides the necessary modular functions
   */
  functions?: I18NFirestoreBackendModuleFuncs;
};

type I18NFirestoreBackendOpts = {
  /**
   * Firestore instance, already initialized and connected
   */
  firestore: any;
  /**
   * identifies if given Firestore is modular, and if so provides the necessary modular functions
   */
  firestoreModule: I18NFirestoreBackendModuleOpts;
  /**
   * whether to enable debug log output
   */
  debug?: boolean;
  /**
   * Collection name for storing i18next data
   */
  collectionName: string;
  /**
   * Field name for language attribute
   */
  languageFieldName: string;
  /**
   * Field name for namespace attribute
   */
  namespaceFieldName: string;
  /**
   * Field name for data attribute
   */
  dataFieldName: string;
  /**
   * Error handler for `read` process
   */
  readOnError: (...data: any[]) => void;
  /**
   * Error handler for `readMulti` process
   */
  readMultiOnError: (...data: any[]) => void;
  /**
   * Error handler for `create` process
   */
  createOnError: (...data: any[]) => void;
};

type I18NFirestoreOpts = {
  /**
   * the backend options to pass for Firestore configuration
   */
  backend: I18NFirestoreBackendOpts;
};

/**
 * Backend class defined to support storing and retrieving i18next translations from Firestore
 */
export class I18NFirestoreBackend {
  /**
   * @param services `i18next.services` - see i18next documentation
   * @param backendOptions Backend Options - see i18next documentation
   * @param i18nextOptions i18next Options - see i18next documentation
   */
  constructor(
    services: any,
    backendOptions: object = {},
    i18nextOptions: I18NFirestoreOpts
  ) {
    this.services = services;
    this.opts = backendOptions;
    this.i18nOpts = i18nextOptions;
    this.MODNAME = 'i18next-node-firestore-backend';

    this.init(services, backendOptions, i18nextOptions);
  }

  services: any;
  opts: Record<string, any>;
  i18nOpts: I18NFirestoreOpts;
  MODNAME: string;
  debug: boolean;
  firestore: any;
  firestoreModule: I18NFirestoreBackendModuleOpts;
  firestoreIsNamespaced: boolean;
  static type: string;

  init(services: any, opts: object, i18nOpts: I18NFirestoreOpts) {
    this.services = services;
    this.i18nOpts = i18nOpts;
    this.opts = { ...defaultOpts, ...opts };

    let bOpts = i18nOpts.backend;

    this.debug = i18nOpts.backend.debug;

    if (this.debug) {
      console.log(`${this.MODNAME}:: options: ${JSON.stringify(bOpts)}`);
    }

    this.firestore = bOpts.firestore;
    this.firestoreModule = bOpts.firestoreModule;

    if (!this.firestore) {
      throw new Error(`${this.MODNAME}:: is null or undefined`);
    }

    if (
      this.firestoreModule?.isModular ||
      !this.firestoreModule?.functions.collection ||
      typeof this.firestoreModule.functions.collection !== 'function'
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
      console.log(`${this.MODNAME}:: this.opts: ${JSON.stringify(this.opts)}`);
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
    const collRef = this.firestoreModule.functions.collection(
      this.firestore,
      this.opts.collectionName
    );
    const q = this.firestoreModule.functions.query(
      collRef,
      this.firestoreModule.functions.where(this.opts.languageFieldName, '==', lang),
      this.firestoreModule.functions.where(this.opts.namespaceFieldName, '==', ns)
    );

    const querySnap = await this.firestoreModule.functions.getDocs(q);
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
I18NFirestoreBackend.type = 'backend';

export default I18NFirestoreBackend;
