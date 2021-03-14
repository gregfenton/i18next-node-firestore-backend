const translations = require('../translations');

export const loadTranslationsToFirestore = async (
  db,
  setAvailableTranslations
) => {
  let {
    REACT_APP_I18N_FIRESTORE_COLLECTION_NAME,
    REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
    REACT_APP_I18N_LANGUAGE_FIELD_NAME,
    REACT_APP_I18N_NAMESPACE_FIELD_NAME,
    REACT_APP_I18N_DATA_FIELD_NAME,
  } = process.env;

  // Populate Firestore with the translation data
  const collRef = db.collection(REACT_APP_I18N_FIRESTORE_COLLECTION_NAME);
  let listOfLangs = new Set();

  for (let i = 0; i < translations.length; i++) {
    let tran = translations[i];
    let currLang = {
      [REACT_APP_I18N_LANGUAGE_FIELD_NAME]: tran.lang,
      [REACT_APP_I18N_NAMESPACE_FIELD_NAME]: tran.ns,
      [REACT_APP_I18N_DATA_FIELD_NAME]: tran.data,
    };

    listOfLangs.add(tran.lang);

    let querySnap = await collRef
      .where(REACT_APP_I18N_LANGUAGE_FIELD_NAME, '==', tran.lang)
      .where(REACT_APP_I18N_NAMESPACE_FIELD_NAME, '==', tran.ns)
      .get();

    if (querySnap.size === 1) {
      await querySnap.docs[0].ref.set(currLang);
    } else if (querySnap.size === 0) {
      await collRef.add(currLang);
    } else {
      console.log(
        `loadTranslationsToFirestore(): already multiple instances of` +
          ` ${REACT_APP_I18N_LANGUAGE_FIELD_NAME}(${tran.lang}),` +
          ` ${REACT_APP_I18N_NAMESPACE_FIELD_NAME}(${tran.ns})`
      );
    }
  }

  listOfLangs = Array.from(listOfLangs).sort();

  await db
    .doc(REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID)
    .set({ translations: listOfLangs });

  setAvailableTranslations(listOfLangs);
};

export default loadTranslationsToFirestore;
