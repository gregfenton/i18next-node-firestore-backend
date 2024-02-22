const defaultOpts = {
    collectionName: 'i18n',
    languageFieldName: 'lang',
    namespaceFieldName: 'ns',
    dataFieldName: 'data',
    readOnError: console.error,
    readMultiOnError: console.error,
    createOnError: console.error,
};
/**
 * Backend class defined to support storing and retrieving i18next translations from Firestore
 */
export class Backend {
    static type;
    /**
     * @param services `i18next.services` - see i18next documentation
     * @param backendOptions Backend Options - see i18next documentation
     * @param i18nextOptions i18next Options - see i18next documentation
     */
    constructor(services, backendOptions = {}, i18nextOptions) {
        this.services = services;
        this.opts = backendOptions;
        this.i18nOpts = i18nextOptions;
        this.MODNAME = 'i18next-node-firestore-backend';
        this.init(services, backendOptions, i18nextOptions);
    }
    services;
    opts;
    i18nOpts;
    MODNAME;
    debug;
    firestore;
    firestoreModule;
    firestoreIsNamespaced;
    init(services, opts, i18nOpts) {
        if (!opts || (typeof opts === 'object' && Object.keys(opts).length === 0)) {
            return;
        }
        this.services = services;
        this.i18nOpts = i18nOpts;
        this.opts = { ...defaultOpts, ...opts };
        let bOpts = i18nOpts.backend;
        this.debug = i18nOpts.backend.debug;
        if (this.debug) {
            console.log(`${this.MODNAME}:: options: ${JSON.stringify(bOpts)}`);
        }
        this.firestore = bOpts.firestore;
        if (!this.firestore) {
            throw new Error(`${this.MODNAME}:: 'backend.firestore' is null or undefined`);
        }
        this.firestoreModule = bOpts.firestoreModule;
        if (!this.firestoreModule) {
            throw new Error(`${this.MODNAME}:: 'backend.firestoreModule' is null or undefined`);
        }
        if (this.firestoreModule.isModular === undefined) {
            console.log(`${this.MODNAME}:: 'backend.firestoreModule.isModular' is undefined`, bOpts);
            throw new Error(`${this.MODNAME}:: 'backend.firestoreModule.isModular' is undefined`);
        }
        this.firestoreIsNamespaced = !this.firestoreModule.isModular;
        /**
         * @param funcs array of value to confirm are all functions
         * @returns true if all values are functions, false otherwise
         */
        const isFunctions = (...funcs) => funcs.every((f) => typeof f === 'function');
        if (this.firestoreModule.isModular &&
            !isFunctions(this.firestoreModule.functions?.collection, this.firestoreModule.functions?.query, this.firestoreModule.functions?.where, this.firestoreModule.functions?.getDocs)) {
            throw new Error(`${this.MODNAME}:: 'backend.firestoreModule.functions' is missing one or more functions`);
        }
        if (this.debug) {
            if (this.firestoreIsNamespaced) {
                console.log(`${this.MODNAME}:: using namespaced Firestore`);
            }
            else {
                console.log(`${this.MODNAME}:: using modular Firestore:`, this.firestoreModule.functions);
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
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    async getDataFromNamedspacedFirestore(lang, ns) {
        if (this.debug) {
            console.log(`${this.MODNAME}:: calling namespaced .collection(${this.opts.collectionName})`);
        }
        const collRef = this.firestore.collection(this.opts.collectionName);
        const q = collRef
            .where(this.opts.languageFieldName, '==', lang)
            .where(this.opts.namespaceFieldName, '==', ns);
        const querySnap = await q.get();
        if (this.debug) {
            console.log(`${this.MODNAME}:: (${this.opts.collectionName}) querySnap.size: ${querySnap.size}`);
        }
        if (querySnap.empty) {
            return null;
        }
        if (querySnap.size > 1) {
            console.warn(`${this.MODNAME}: Found ${querySnap.size} docs for namespace ${ns}`);
        }
        const data = querySnap.docs[0].data();
        if (this.debug) {
            console.log(`${this.MODNAME}:: collection data:`, data);
        }
        return data;
    }
    /**
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    async getDataFromModularFirestore(lang, ns) {
        if (this.debug) {
            console.log(`${this.MODNAME}:: calling modular collection(${this.opts.collectionName})`);
        }
        const collRef = this.firestoreModule.functions.collection(this.firestore, this.opts.collectionName);
        const q = this.firestoreModule.functions.query(collRef, this.firestoreModule.functions.where(this.opts.languageFieldName, '==', lang), this.firestoreModule.functions.where(this.opts.namespaceFieldName, '==', ns));
        const querySnap = await this.firestoreModule.functions.getDocs(q);
        if (this.debug) {
            console.log(`${this.MODNAME}:: (${this.opts.collectionName}) querySnap.size:`, querySnap.size);
        }
        if (querySnap.empty) {
            return null;
        }
        if (querySnap.size > 1) {
            console.warn(`${this.MODNAME}: Found ${querySnap.size} docs for namespace ${ns}`);
        }
        const data = querySnap.docs[0].data();
        if (this.debug) {
            console.log(`${this.MODNAME}:: collection data:`, data);
        }
        return data;
    }
    /**
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    async getLanguageAndNamespace(lang, ns) {
        if (!this.firestore ||
            !this.opts.collectionName ||
            !this.opts.languageFieldName ||
            !this.opts.namespaceFieldName) {
            return null;
        }
        return this.firestoreIsNamespaced
            ? this.getDataFromNamedspacedFirestore(lang, ns)
            : this.getDataFromModularFirestore(lang, ns);
    }
    /**
     * @param langs array of languages
     * @param nss array of namespaces
     * @returns an object with the translations for each language and namespace
     */
    async getLanguagesAndNamespaces(langs, nss) {
        let res = {};
        for (let i = 0; i < langs.length; i++) {
            for (let j = 0; j < nss.length; j++) {
                if (!res[langs[i]]) {
                    res[langs[i]] = {};
                }
                res[langs[i]][nss[j]] = await this.getLanguageAndNamespace(langs[i], nss[j]);
            }
        }
        return res;
    }
    async read(lang, ns, cb) {
        if (!cb)
            return;
        try {
            const doc = await this.getLanguageAndNamespace(lang, ns);
            if (!doc && this.debug) {
                console.log(`${this.MODNAME}: Failed to find data for lang(${lang}), ns(${ns})`);
            }
            cb(null, (doc && doc[this.opts.dataFieldName]) || {});
        }
        catch (ex) {
            this.opts.readOnError(ex);
        }
    }
    readMulti(langs, nss, cb) {
        if (!cb)
            return;
        let x = 'NOT IMPLEMENTED YET';
        if (x === 'NOT IMPLEMENTED YET') {
            console.error(x);
            return;
        }
    }
    create(langs, ns, key, fallbackVal) {
        let x = 'NOT IMPLEMENTED YET';
        if (x === 'NOT IMPLEMENTED YET') {
            console.error(x);
            return;
        }
    }
}
Backend.type = 'backend';
export default Backend;
