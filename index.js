// https://www.i18next.com/misc/creating-own-plugins#backend

const defaultOpts = {
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

class Backend {
  /**
   * @param {*} services `i18next.services`
   * @param {object} backendOptions Backend Options
   * @param {object} opts.firestore Firestore instance, already initialized and connected
   * @param {string} [opts.collectionName='i18n'] Collection name for storing i18next data
   * @param {string} [opts.languageFieldName="lang"] Field name for language attribute
   * @param {string} [opts.namespaceFieldName="ns"] Field name for namespace attribute
   * @param {string} [opts.dataFieldName="data"] Field name for data attribute
   * @param {function} [opts.readOnError] Error handler for `read` process
   * @param {function} [opts.readMultiOnError] Error handler for `readMulti` process
   * @param {function} [opts.createOnError] Error handler for `create` process
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
    let querySnap = await this.firestore
      .collection(this.opts.collectionName)
      .where(this.opts.languageFieldName, '==', lang)
      .where(this.opts.namespaceFieldName, '==', ns)
      .get();

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
      .catch(this.opts.readOnError);
  }

  readMulti(langs, nss, cb) {
    if (!cb) return;

    let res = {};

    this.getClient()
      .then(async (client) => {
        const col = await this.getCollection(client);

        const docs = await col
          .find({
            [this.opts.languageFieldName]: { $in: langs },
            [this.opts.namespaceFieldName]: { $in: nss },
          })
          .toArray();

        const parsed = {};

        for (let i = 0; i < docs.length; i += 1) {
          const doc = docs[i];
          const lang = doc[this.opts.languageFieldName];
          const ns = doc[this.opts.namespaceFieldName];
          const data = doc[this.opts.dataFieldName];

          if (!parsed[lang]) {
            parsed[lang] = {};
          }

          parsed[lang][ns] = data;
        }

        cb(null, parsed);
      })
      .catch(this.opts.readMultiOnError);
  }

  create(langs, ns, key, fallbackVal, cb) {
    this.getClient()
      .then(async (client) => {
        const col = await this.getCollection(client);

        // Make `updateOne` process run concurrently
        await Promise.all(
          (typeof langs === 'string' ? [langs] : langs).map((lang) =>
            col.updateOne(
              {
                [this.opts.languageFieldName]: lang,
                [this.opts.namespaceFieldName]: ns,
              },
              {
                $set: {
                  [`${this.opts.dataFieldName}.${key}`]: fallbackVal,
                },
              },
              {
                upsert: true,
              }
            )
          )
        );

        // If `this.client` exists (equal to if use custom MongoClient), don't close connection
        if (!this.client && client.isConnected()) await client.close();
        if (cb) cb();
      })
      .catch(this.opts.createOnError);
  }
}

// https://www.i18next.com/misc/creating-own-plugins#make-sure-to-set-the-plugin-type
Backend.type = 'backend';

module.exports = Backend;
