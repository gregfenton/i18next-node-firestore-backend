import { BackendModule } from 'i18next';
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
export type I18NFirestoreBackendOpts = {
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
export declare class I18NextFirestoreBackend implements BackendModule<I18NFirestoreBackendOpts> {
    static type: 'backend';
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
    init(services: any, opts: object, i18nOpts: I18NFirestoreOpts): void;
    /**
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    getDataFromNamedspacedFirestore(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    getDataFromModularFirestore(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     * @param lang the language code (e.g. "tr" or "en")
     * @param ns the namespace code (e.g. "colors", "greetings")
     * @returns the document from Firestore with the translations in field `data`
     */
    getLanguageAndNamespace(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     * @param langs array of languages
     * @param nss array of namespaces
     * @returns an object with the translations for each language and namespace
     */
    getLanguagesAndNamespaces(langs: string[], nss: string[]): Promise<{
        [lang: string]: {
            [ns: string]: {
                data: {
                    [code: string]: string;
                };
                language: string;
                namespace: string;
            };
        };
    }>;
    read(lang: string, ns: string, cb: Function): Promise<void>;
    readMulti(langs: string[], nss: string[], cb: Function): void;
    create(langs: readonly string[], ns: string, key: string, fallbackVal: string): void;
    type: 'backend';
}
export default I18NextFirestoreBackend;
//# sourceMappingURL=index.d.ts.map