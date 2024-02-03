"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18NFirestoreBackend = exports.defaultOpts = void 0;
// https://www.i18next.com/misc/creating-own-plugins#backend
exports.defaultOpts = {
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
var I18NFirestoreBackend = /** @class */ (function () {
    /**
     * @param services `i18next.services` - see i18next documentation
     * @param backendOptions Backend Options - see i18next documentation
     * @param i18nextOptions i18next Options - see i18next documentation
     */
    function I18NFirestoreBackend(services, backendOptions, i18nextOptions) {
        if (backendOptions === void 0) { backendOptions = {}; }
        this.services = services;
        this.opts = backendOptions;
        this.i18nOpts = i18nextOptions;
        this.MODNAME = 'i18next-node-firestore-backend';
        this.init(services, backendOptions, i18nextOptions);
    }
    I18NFirestoreBackend.prototype.init = function (services, opts, i18nOpts) {
        var _a, _b;
        this.services = services;
        this.i18nOpts = i18nOpts;
        this.opts = __assign(__assign({}, exports.defaultOpts), opts);
        var bOpts = i18nOpts.backend;
        this.debug = i18nOpts.backend.debug;
        if (this.debug) {
            console.log("".concat(this.MODNAME, ":: options: ").concat(JSON.stringify(bOpts)));
        }
        this.firestore = bOpts.firestore;
        this.firestoreModule = bOpts.firestoreModule;
        if (!this.firestore) {
            throw new Error("".concat(this.MODNAME, ":: is null or undefined"));
        }
        if (((_a = this.firestoreModule) === null || _a === void 0 ? void 0 : _a.isModular) ||
            !((_b = this.firestoreModule) === null || _b === void 0 ? void 0 : _b.functions.collection) ||
            typeof this.firestoreModule.functions.collection !== 'function') {
            this.firestoreIsNamespaced = true;
        }
        if (this.debug) {
            if (this.firestoreIsNamespaced) {
                console.log("".concat(this.MODNAME, ":: using namespaced Firestore"));
            }
            else {
                console.log("".concat(this.MODNAME, ":: using modular Firestore:"), this.firestoreModule);
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
            console.log("".concat(this.MODNAME, ":: this.opts: ").concat(JSON.stringify(this.opts)));
        }
    };
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    I18NFirestoreBackend.prototype.getDataFromNamedspacedFirestore = function (lang, ns) {
        return __awaiter(this, void 0, void 0, function () {
            var collRef, q, querySnap, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collRef = this.firestore.collection(this.opts.collectionName);
                        q = collRef
                            .where(this.opts.languageFieldName, '==', lang)
                            .where(this.opts.namespaceFieldName, '==', ns);
                        return [4 /*yield*/, q.get()];
                    case 1:
                        querySnap = _a.sent();
                        if (this.debug) {
                            console.log("".concat(this.MODNAME, ":: (").concat(this.opts.collectionName, ") querySnap.size: ").concat(querySnap.size));
                        }
                        if (querySnap.empty) {
                            return [2 /*return*/, null];
                        }
                        if (querySnap.size > 1) {
                            console.warn("".concat(this.MODNAME, ": Found ").concat(querySnap.size, " docs for namespace ").concat(ns));
                        }
                        data = querySnap.docs[0].data();
                        if (this.debug) {
                            console.log("".concat(this.MODNAME, ":: collection data:"), data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    I18NFirestoreBackend.prototype.getDataFromModularFirestore = function (lang, ns) {
        return __awaiter(this, void 0, void 0, function () {
            var collRef, q, querySnap, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collRef = this.firestoreModule.functions.collection(this.firestore, this.opts.collectionName);
                        q = this.firestoreModule.functions.query(collRef, this.firestoreModule.functions.where(this.opts.languageFieldName, '==', lang), this.firestoreModule.functions.where(this.opts.namespaceFieldName, '==', ns));
                        return [4 /*yield*/, this.firestoreModule.functions.getDocs(q)];
                    case 1:
                        querySnap = _a.sent();
                        if (this.debug) {
                            console.log("".concat(this.MODNAME, ":: (").concat(this.opts.collectionName, ") querySnap.size: ").concat(querySnap.size));
                        }
                        if (querySnap.empty) {
                            return [2 /*return*/, null];
                        }
                        if (querySnap.size > 1) {
                            console.warn("".concat(this.MODNAME, ": Found ").concat(querySnap.size, " docs for namespace ").concat(ns));
                        }
                        data = querySnap.docs[0].data();
                        if (this.debug) {
                            console.log("".concat(this.MODNAME, ":: collection data:"), data);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * @param {string} lang the language code (e.g. "tr" or "en")
     * @param {string} ns the namespace code (e.g. "colors", "greetings")
     * @returns {Promise<{data: {[code: string]: string}, language: string, namespace: string}>} the document from Firestore with the translations in field `data`
     */
    I18NFirestoreBackend.prototype.getLanguageAndNamespace = function (lang, ns) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                if (!this.firestore ||
                    !this.opts.collectionName ||
                    !this.opts.languageFieldName ||
                    !this.opts.namespaceFieldName) {
                    return [2 /*return*/, null];
                }
                if (this.firestoreIsNamespaced) {
                    data = this.getDataFromNamedspacedFirestore(lang, ns);
                }
                else {
                    data = this.getDataFromModularFirestore(lang, ns);
                }
                return [2 /*return*/, data];
            });
        });
    };
    /**
     *
     * @param {string[]} langs array of languages
     * @param {string[]} nss array of namespaces
     * @returns {Promise<{[lang: string]: {[ns: string]: {data: {[code: string]: string}, language: string, namespace: string}}}>
     */
    I18NFirestoreBackend.prototype.getLanguagesAndNamespaces = function (langs, nss) {
        return __awaiter(this, void 0, void 0, function () {
            var res, i, j, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        res = {};
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < langs.length)) return [3 /*break*/, 6];
                        j = 0;
                        _c.label = 2;
                    case 2:
                        if (!(j < nss.length)) return [3 /*break*/, 5];
                        if (!res[langs[i]]) {
                            res[langs[i]] = {};
                        }
                        _a = res[langs[i]];
                        _b = nss[j];
                        return [4 /*yield*/, this.getLanguageAndNamespace(langs[i], nss[j])];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, res];
                }
            });
        });
    };
    I18NFirestoreBackend.prototype.read = function (lang, ns, cb) {
        var _this = this;
        if (!cb)
            return;
        return this.getLanguageAndNamespace(lang, ns)
            .then(function (doc) {
            if (!doc && _this.debug) {
                console.log("".concat(_this.MODNAME, ": Failed to find data for lang(").concat(lang, "), ns(").concat(ns, ")"));
            }
            cb(null, (doc && doc[_this.opts.dataFieldName]) || {});
        })
            .catch(function (ex) {
            _this.opts.readOnError(ex);
        });
    };
    I18NFirestoreBackend.prototype.readMulti = function (langs, nss, cb) {
        if (!cb)
            return;
        var x = 'NOT IMPLEMENTED YET';
        if (x === 'NOT IMPLEMENTED YET') {
            console.error(x);
            return;
        }
    };
    I18NFirestoreBackend.prototype.create = function (langs, ns, key, fallbackVal, cb) {
        var x = 'NOT IMPLEMENTED YET';
        if (x === 'NOT IMPLEMENTED YET') {
            console.error(x);
            return;
        }
    };
    return I18NFirestoreBackend;
}());
exports.I18NFirestoreBackend = I18NFirestoreBackend;
// https://www.i18next.com/misc/creating-own-plugins#make-sure-to-set-the-plugin-type
I18NFirestoreBackend.type = 'backend';
exports.default = I18NFirestoreBackend;
