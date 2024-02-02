import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import translations from '../translations';

export const deleteTranslationsFromFirestore = async (db, setAvailableTranslations) => {
  let {
    VITE_I18N_FIRESTORE_COLLECTION_NAME,
    VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
    VITE_I18N_LANGUAGE_FIELD_NAME,
    VITE_I18N_NAMESPACE_FIELD_NAME,
  } = import.meta.env;

  const collRef = collection(db, VITE_I18N_FIRESTORE_COLLECTION_NAME);

  for (let i = 0; i < translations.length; i++) {
    const tran = translations[i];
    const q = query(
      collRef,
      where(VITE_I18N_LANGUAGE_FIELD_NAME, '==', tran.lang),
      where(VITE_I18N_NAMESPACE_FIELD_NAME, '==', tran.ns)
    );
    const querySnap = await getDocs(q);
    
    for (let j = 0; j < querySnap.size; j++) {
      await deleteDoc(querySnap.docs[j].ref);
    }    
  }

  const docRef = doc(db, VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID);
  await deleteDoc(docRef);

  setAvailableTranslations(null);
}

export const loadTranslationsToFirestore = async (
  db,
  setAvailableTranslations
) => {
  let {
    VITE_I18N_FIRESTORE_COLLECTION_NAME,
    VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
    VITE_I18N_LANGUAGE_FIELD_NAME,
    VITE_I18N_NAMESPACE_FIELD_NAME,
    VITE_I18N_DATA_FIELD_NAME,
  } = import.meta.env;

  // Populate Firestore with the translation data
  const collRef = collection(db, VITE_I18N_FIRESTORE_COLLECTION_NAME);
  let listOfLangs = new Set();

  for (let i = 0; i < translations.length; i++) {
    const tran = translations[i];
    const currLang = {
      [VITE_I18N_LANGUAGE_FIELD_NAME]: tran.lang,
      [VITE_I18N_NAMESPACE_FIELD_NAME]: tran.ns,
      [VITE_I18N_DATA_FIELD_NAME]: tran.data,
    };

    listOfLangs.add(tran.lang);

    const q = query(
      collRef,
      where(VITE_I18N_LANGUAGE_FIELD_NAME, '==', tran.lang),
      where(VITE_I18N_NAMESPACE_FIELD_NAME, '==', tran.ns)
    );
    const querySnap = await getDocs(q);

    if (querySnap.size === 1) {
      await setDoc(querySnap.docs[0].ref, currLang);
    } else if (querySnap.size === 0) {
      await addDoc(collRef, currLang);
    } else {
      console.log(
        `loadTranslationsToFirestore(): already multiple instances of` +
          ` ${VITE_I18N_LANGUAGE_FIELD_NAME}(${tran.lang}),` +
          ` ${VITE_I18N_NAMESPACE_FIELD_NAME}(${tran.ns})`
      );
    }
  }

  listOfLangs = Array.from(listOfLangs).sort();

  let docRef = doc(db, VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID);
  await setDoc(docRef, { translations: listOfLangs });

  setAvailableTranslations(listOfLangs);
};

export default loadTranslationsToFirestore;
