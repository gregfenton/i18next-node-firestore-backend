import React, { useEffect } from 'react';
import loadTranslationsToFirestore from '../utils/firestore-i18n-utils';

const SelectLanguageScreen = (props) => {
  let firebaseApp = props.firebaseApp;
  let setAvailableTranslations = props.setAvailableTranslations;

  let FIRESTORE = firebaseApp.firestore();

  let { REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID } = process.env;

  // loads list of translations
  useEffect(() => {
    const getLanguages = async () => {
      let docSnap = await FIRESTORE.doc(
        REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID
      ).get();

      console.log(`getting languages: ${docSnap.exists}`);
      if (docSnap.exists) {
        let data = docSnap.data();
        console.log(`getting languages: ${JSON.stringify(data)}`);
        setAvailableTranslations(data.translations);
      }
    };

    getLanguages();
  }, [
    FIRESTORE,
    setAvailableTranslations,
    REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
  ]);

  return (
    <div>
      <h1>Translations not yet loaded to Firestore</h1>
      <p>
        [Translations list not found at Firestore collection path:{' '}
        <em style={{ color: 'darkgreen' }}>
          {REACT_APP_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID}
        </em>
        ]
      </p>
      <button
        onClick={() =>
          loadTranslationsToFirestore(FIRESTORE, setAvailableTranslations)
        }
      >
        Load Languages
      </button>
    </div>
  );
};

export default SelectLanguageScreen;
