export declare const defaultOpts: {
    collectionName: string;
    languageFieldName: string;
    namespaceFieldName: string;
    dataFieldName: string;
    readOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    readMultiOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    createOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
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
export declare class I18NFirestoreBackend {
    /**
     * @param services `i18next.services` - see i18next documentation
     * @param backendOptions Backend Options - see i18next documentation
     * @param i18nextOptions i18next Options - see i18next documentation
     */
    constructor(services: any, backendOptions: object, i18nextOptions: I18NFirestoreOpts);
    services: any;
    opts: Record<string, any>;
    i18nOpts: I18NFirestoreOpts;
    MODNAME: string;
    debug: boolean;
    firestore: any;
    firestoreModule: I18NFirestoreBackendModuleOpts;
    firestoreIsNamespaced: boolean;
    static type: string;
    init(services: any, opts: object, i18nOpts: I18NFirestoreOpts): void;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getDataFromNamedspacedFirestore(lang: any, ns: any): Promise<any>;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getDataFromModularFirestore(lang: any, ns: any): Promise<any>;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getLanguageAndNamespace(lang: any, ns: any): Promise<any>;
    /**
     *
     * @param {string[]} langs array of languages
     * @param {string[]} nss array of namespaces
     * @returns {Promise<{[lang: string]: {[ns: string]: {data: {[code: string]: string}, language: string, namespace: string}}}>
     */
    getLanguagesAndNamespaces(langs: any, nss: any): Promise<{}>;
    read(lang: any, ns: any, cb: any): Promise<void>;
    readMulti(langs: any, nss: any, cb: any): void;
    create(langs: any, ns: any, key: any, fallbackVal: any, cb: any): void;
}
export default I18NFirestoreBackend;
//# sourceMappingURL=index.d.ts.map