import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import * as FIRESTORE_MODULE from 'firebase/firestore';

import dotenv from 'dotenv';

import i18next from 'i18next';
import Backend from 'i18next-node-firestore-backend';

import translations from './translations.js';

let THE_FIREBASE_APP, THE_AUTH, THE_FIRESTORE;

dotenv.config();

const {
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
      host: EMULATOR_FIRESTORE_PORT,
      ssl: EMULATOR_FIRESTORE_SSL,
    };
  }

  // Initialize the Firebase client SDK
  //
  THE_FIREBASE_APP = initializeApp(FIREBASE_CONFIG);

  THE_FIRESTORE = getFirestore(THE_FIREBASE_APP);
  if (EMULATOR_CONFIG) {
    console.log(
      `USING EMULATOR: Firestore: ${JSON.stringify(EMULATOR_CONFIG.firestore)}`
    );
    connectFirestoreEmulator(
      THE_FIRESTORE,
      EMULATOR_CONFIG.firestore.host,
      EMULATOR_CONFIG.firestore.port
    );
  }

  THE_AUTH = getAuth(THE_FIREBASE_APP);
  await signInWithEmailAndPassword(THE_AUTH, USER.email, USER.password);

  return THE_FIRESTORE;
};

const loadTranslationsToFirestore = async (db, translations) => {
  // Populate Firestore with the translation data
  const collRef = collection(db, I18N_FIRESTORE_COLLECTION_NAME);
  let listOfLangs = new Set();

  for (let i = 0; i < translations.length; i++) {
    const tran = translations[i];
    const currLang = {
      [I18N_LANGUAGE_FIELD_NAME]: tran.lang,
      [I18N_NAMESPACE_FIELD_NAME]: tran.ns,
      [I18N_DATA_FIELD_NAME]: tran.data,
    };

    listOfLangs.add(tran.lang);

    const q = query(
      collRef,
      where(I18N_LANGUAGE_FIELD_NAME, '==', tran.lang),
      where(I18N_NAMESPACE_FIELD_NAME, '==', tran.ns)
    );

    const querySnap = await getDocs(q);

    if (querySnap.size === 1) {
      // update the existing document
      await setDoc(querySnap.docs[0].ref, currLang);
    } else if (querySnap.size === 0) {
      // create a new document
      await addDoc(collRef, currLang);
    } else {
      console.log(
        `loadTranslationsToFirestore(): already multiple instances of` +
          ` ${I18N_LANGUAGE_FIELD_NAME}(${tran.lang}),` +
          ` ${I18N_NAMESPACE_FIELD_NAME}(${tran.ns})`
      );
    }
  }

  listOfLangs = Array.from(listOfLangs).sort();

  const docRef = doc(db, I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID);
  await setDoc(docRef, { translations: listOfLangs });
};

const main = async () => {
  console.log(`>> Connect to Firestore`);
  const fsDB = await connectToFirestore();

  console.log(`>> Load translations into Firestore`);
  await loadTranslationsToFirestore(fsDB, translations);

  console.log(`>> Initialize i18next & i18next-node-firestore-backend`);
  let be = await i18next.use(Backend).init({
    backend: {
      firestore: fsDB,
      firestoreModule: FIRESTORE_MODULE,
      collectionName: I18N_FIRESTORE_COLLECTION_NAME,
      languageFieldName: I18N_LANGUAGE_FIELD_NAME,
      namespaceFieldName: I18N_NAMESPACE_FIELD_NAME,
      dataFieldName: I18N_DATA_FIELD_NAME,
      debug: true,
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

    let key = 'does-not-exist';
    let x = t(`${ns}:${key}`);
    console.log(`  ${lang} => ${ns}:${key} >> ${x}`);
  }
};

const gracefulShutdown = async () => {
  try {
    signOut(THE_AUTH);
  } catch (error) {
    console.error('Error graceful shutdown');
    throw error;
  }
};

main()
  .then(() => {
    console.log('\nDone.');
    return gracefulShutdown();
  })
  .then(() => process.exit(0))
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
