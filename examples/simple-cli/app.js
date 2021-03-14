import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import dotenv from 'dotenv';

const i18next = require('i18next');
const Backend = require('../../index.js');

const translations = require('./translations');

let FIRESTORE;

dotenv.config();

let {
  EMULATOR_FIRESTORE_HOST,
  EMULATOR_FIRESTORE_SSL,
  EMULATOR_USE_EMULATOR,
  FIREBASE_APIKEY,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_DATABASEURL,
  FIREBASE_PROJECTID,
  I18N_FIRESTORE_COLLECTION_NAME,
  I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
  I18N_LANGUAGE_FIELD_NAME,
  I18N_NAMESPACE_FIELD_NAME,
  I18N_DATA_FIELD_NAME,
  I18N_LIST_OF_NAMESPACES,
  USER_EMAIL,
  USER_PASSWORD,
} = process.env;

let LIST_OF_NAMESPACES = I18N_LIST_OF_NAMESPACES.split(',');

/**
 * Initialize Firebase client SDK to authenticate the user and to use Firestore
 */
const connectToFirestore = async () => {
  let FIREBASE_CONFIG = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    databaseURL: FIREBASE_DATABASEURL,
    projectId: FIREBASE_PROJECTID,
  };

  let USER = {
    email: USER_EMAIL,
    password: USER_PASSWORD,
  };

  let EMULATOR_CONFIG = null;
  if (Boolean(EMULATOR_USE_EMULATOR === 'true')) {
    EMULATOR_CONFIG = {
      host: EMULATOR_FIRESTORE_HOST,
      ssl: EMULATOR_FIRESTORE_SSL,
    };
  }

  // Initialize the Firebase client SDK
  //
  firebase.initializeApp(FIREBASE_CONFIG);

  let firestoreDB = firebase.firestore();
  if (EMULATOR_CONFIG) {
    console.log(
      `USING EMULATOR: Firestore: ${JSON.stringify(EMULATOR_CONFIG.firestore)}`
    );
    firestoreDB.settings(EMULATOR_CONFIG.firestore);
  }

  await firebase.auth().signInWithEmailAndPassword(USER.email, USER.password);

  return firestoreDB;
};

const loadTranslationsToFirestore = async (db, translations) => {
  // Populate Firestore with the translation data
  const collRef = db.collection(I18N_FIRESTORE_COLLECTION_NAME);
  let listOfLangs = new Set();

  for (let i = 0; i < translations.length; i++) {
    let tran = translations[i];
    let currLang = {
      [I18N_LANGUAGE_FIELD_NAME]: tran.lang,
      [I18N_NAMESPACE_FIELD_NAME]: tran.ns,
      [I18N_DATA_FIELD_NAME]: tran.data,
    };

    listOfLangs.add(tran.lang);

    let querySnap = await collRef
      .where(I18N_LANGUAGE_FIELD_NAME, '==', tran.lang)
      .where(I18N_NAMESPACE_FIELD_NAME, '==', tran.ns)
      .get();

    if (querySnap.size === 1) {
      await querySnap.docs[0].ref.set(currLang);
    } else if (querySnap.size === 0) {
      await collRef.add(currLang);
    } else {
      console.log(
        `loadTranslationsToFirestore(): already multiple instances of` +
          ` ${I18N_LANGUAGE_FIELD_NAME}(${tran.lang}),` +
          ` ${I18N_NAMESPACE_FIELD_NAME}(${tran.ns})`
      );
    }
  }

  listOfLangs = Array.from(listOfLangs).sort();

  await db
    .doc(I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID)
    .set({ translations: listOfLangs });
};

const main = async () => {
  console.log(`>> Connect to Firestore`);
  FIRESTORE = await connectToFirestore();

  console.log(`>> Load translations into Firestore`);
  await loadTranslationsToFirestore(FIRESTORE, translations);
  
  console.log(`>> Initialize i18next & i18next-node-firestore-backend`);
  let be = await i18next.use(Backend).init({
    backend: {
      firestore: FIRESTORE,
      collectionName: I18N_FIRESTORE_COLLECTION_NAME,
      languageFieldName: I18N_LANGUAGE_FIELD_NAME,
      namespaceFieldName: I18N_NAMESPACE_FIELD_NAME,
      dataFieldName: I18N_DATA_FIELD_NAME,
      debug: false
    },
    debug: false,
    fallbackLng: 'en',
    ns: LIST_OF_NAMESPACES,
  });
  
  console.log(`>> Start translating!\n`);
  for (let i = 0; i < translations.length; i += 1) {

    // We only use the translation table here to get the keys.
    // We fetch the translation values from Firestore.
    // In a normal app, you don't loop over the translations values.
    let { lang, ns, data } = translations[i];

    // fetches the Language Document from Firestore
    let t = await i18next.changeLanguage(lang);

    Object.entries(data).forEach(([key]) => {
      // uses the Language Document to get translated string
      let x = t(`${ns}:${key}`);
      console.log(`  ${lang} => ${ns}:${key} >> ${x}`);
    });
    
    let key = "does-not-exist"
    let x = t(`${ns}:${key}`);
    console.log(`  ${lang} => ${ns}:${key} >> ${x}`);
  }
};

const gracefulShutdown = async () => {
  try {
    firebase.auth().signOut();
    process.exit(0);
  } catch (error) {
    console.error(error);
    console.error('Error graceful shutdown');
    process.exit(1);
  }
};

main()
  .then(() => {
    console.log('\nDone.');
    return gracefulShutdown();
  })
  .then(() => process.exit(0))
  .catch(console.error);
