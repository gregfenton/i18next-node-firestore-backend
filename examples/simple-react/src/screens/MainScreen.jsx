import React, { useEffect, useState } from 'react';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-node-firestore-backend';

import DisplayTranslationData from '../components/DisplayTranslationData';
import LanguagePicker from '../components/LanguagePicker';

let FIRESTORE = null;
let DEFAULT_TRANSLATION = 'en';
let {
  REACT_APP_I18N_FIRESTORE_COLLECTION_NAME,
  REACT_APP_I18N_LANGUAGE_FIELD_NAME,
  REACT_APP_I18N_NAMESPACE_FIELD_NAME,
  REACT_APP_I18N_DATA_FIELD_NAME,
  REACT_APP_I18N_LIST_OF_NAMESPACES
} = process.env;

let LIST_OF_NAMESPACES = REACT_APP_I18N_LIST_OF_NAMESPACES.split(',');

const MainScreen = (props) => {
  let authUser = props.authUser;
  let firebaseApp = props.firebaseApp;
  let availableTranslations = props.availableTranslations;

  const [i18nInitialized, setI18nInitialized] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState();

  if (!FIRESTORE && firebaseApp) {
    FIRESTORE = firebaseApp.firestore();
  }

  // initialize i18next
  useEffect(() => {
    const setupI18Next = async () => {
      await i18next
        .use(Backend)
        .use(initReactI18next)
        .init({
          backend: {
            firestore: FIRESTORE,
            collectionName: REACT_APP_I18N_FIRESTORE_COLLECTION_NAME,
            languageFieldName: REACT_APP_I18N_LANGUAGE_FIELD_NAME,
            namespaceFieldName: REACT_APP_I18N_NAMESPACE_FIELD_NAME,
            dataFieldName: REACT_APP_I18N_DATA_FIELD_NAME,
            debug: true,
          },
          debug: false,
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false, // not needed for react
          },
          load: 'currentOnly',  // don't auto-load other langs (en vs. en-US)
          ns: LIST_OF_NAMESPACES,
          react: {
            useSuspense: false, // <---- this will do the magic
          },
        });
      setI18nInitialized(true);
      setSelectedTranslation(DEFAULT_TRANSLATION);
    };

    setupI18Next();
  }, []);

  // loads a specific translation when chosen
  useEffect(() => {
    const changeLang = async () => {
      await i18next.changeLanguage(selectedTranslation);
    };

    if (selectedTranslation && i18nInitialized) {
      changeLang();
    }
  }, [selectedTranslation, i18nInitialized]);

  return (
    <div>
      <h2>Hello {authUser.email}</h2>
      <h3>Current Language: {selectedTranslation}</h3>
      <LanguagePicker
        availableTranslations={availableTranslations}
        setSelectedTranslation={setSelectedTranslation}
      />
      {!i18nInitialized ? (
        <div>Loading...</div>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <DisplayTranslationData selectedTranslation={selectedTranslation} listOfNamespaces={LIST_OF_NAMESPACES} />
        </div>
      )}
    </div>
  );
};

export default MainScreen;
