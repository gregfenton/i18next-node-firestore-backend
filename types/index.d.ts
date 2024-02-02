export namespace defaultOpts {
    let collectionName: string;
    let languageFieldName: string;
    let namespaceFieldName: string;
    let dataFieldName: string;
    let readOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    let readMultiOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    let createOnError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
}
export class Backend {
    /**
     * @param {*} services `i18next.services`
     * @param {object} backendOptions Backend Options
     * @param {Firestore} i18nextOptions.backend.firestore Firestore instance, already initialized and connected
     * @param {{isNamespaced?: boolean, collection?: Function, query?: Function, where?: Function, getDocs?: Function}} i18nextOptions.backend.firestoreModule identifies if given Firestore is modular, and if so provides the necessary modular functions
     * @param {string} [i18nextOptions.backend.collectionName='i18n'] Collection name for storing i18next data
     * @param {string} [i18nextOptions.backend.languageFieldName="lang"] Field name for language attribute
     * @param {string} [i18nextOptions.backend.namespaceFieldName="ns"] Field name for namespace attribute
     * @param {string} [i18nextOptions.backend.dataFieldName="data"] Field name for data attribute
     * @param {function} [i18nextOptions.backend.readOnError] Error handler for `read` process
     * @param {function} [i18nextOptions.backend.readMultiOnError] Error handler for `readMulti` process
     * @param {function} [i18nextOptions.backend.createOnError] Error handler for `create` process
     */
    constructor(services: any, backendOptions?: object, i18nextOptions?: {});
    services: any;
    opts: any;
    i18nOpts: {};
    MODNAME: string;
    init(services: any, opts: any, i18nOpts: any): void;
    debug: any;
    firestore: any;
    firestoreModule: any;
    firestoreIsNamespaced: boolean;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getDataFromNamedspacedFirestore(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getDataFromModularFirestore(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    getLanguageAndNamespace(lang: string, ns: string): Promise<{
        data: {
            [code: string]: string;
        };
        language: string;
        namespace: string;
    }>;
    /**
     *
     * @param {string[]} langs array of languages
     * @param {string[]} nss array of namespaces
     * @returns {Promise<{[lang: string]: {[ns: string]: {data: {[code: string]: string}, language: string, namespace: string}}}>
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
    read(lang: any, ns: any, cb: any): Promise<void>;
    readMulti(langs: any, nss: any, cb: any): void;
    create(langs: any, ns: any, key: any, fallbackVal: any, cb: any): void;
}
export namespace Backend {
    let type: string;
}
export default Backend;
//# sourceMappingURL=index.d.ts.map