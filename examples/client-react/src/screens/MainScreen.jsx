import * as firestoreModule from 'firebase/firestore';
import { useEffect, useState } from 'react';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-node-firestore-backend';

import DisplayTranslationData from '../components/DisplayTranslationData';
import LanguagePicker from '../components/LanguagePicker';
import { useAuthContext } from '../providers/AuthProvider';
import { useFirebaseContext } from '../providers/FirebaseProvider';
import { deleteTranslationsFromFirestore } from '../utils/firestore-i18n-utils';

let DEFAULT_TRANSLATION = 'en';

let {
  VITE_I18N_FIRESTORE_COLLECTION_NAME,
  VITE_I18N_LANGUAGE_FIELD_NAME,
  VITE_I18N_NAMESPACE_FIELD_NAME,
  VITE_I18N_DATA_FIELD_NAME,
  VITE_I18N_LIST_OF_NAMESPACES,
} = import.meta.env;

let LIST_OF_NAMESPACES = VITE_I18N_LIST_OF_NAMESPACES?.split(',');

export const MainScreen = (props) => {
  const { availableTranslations, setAvailableTranslations } = props;

  const [i18nInitialized, setI18nInitialized] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState();

  const { user, logout } = useAuthContext();
  const { myFS } = useFirebaseContext();

  // initialize i18next
  useEffect(() => {
    const setupI18Next = async () => {
      await i18next
        .use(Backend)
        .use(initReactI18next)
        .init({
          backend: {
            firestore: myFS,
            firestoreModule: firestoreModule,
            collectionName: VITE_I18N_FIRESTORE_COLLECTION_NAME,
            languageFieldName: VITE_I18N_LANGUAGE_FIELD_NAME,
            namespaceFieldName: VITE_I18N_NAMESPACE_FIELD_NAME,
            dataFieldName: VITE_I18N_DATA_FIELD_NAME,
            debug: true,
          },
          debug: false,
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false, // not needed for react
          },
          load: 'currentOnly', // don't auto-load other langs (en vs. en-US)
          ns: LIST_OF_NAMESPACES,
          react: {
            useSuspense: false, // <---- this will do the magic
          },
        });
      setI18nInitialized(true);
      setSelectedTranslation(DEFAULT_TRANSLATION);
    };

    setupI18Next();
  }, [myFS]);

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
      <h2>Hello {user.displayName ?? user.email}</h2>
      <h3>Current Language: {selectedTranslation}</h3>
      <LanguagePicker
        availableTranslations={availableTranslations}
        setSelectedTranslation={setSelectedTranslation}
      />
      {!i18nInitialized ? (
        <div style={{ height: '250px', marginTop: '10px' }}>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div style={{ minHeight: '250px', marginTop: '10px' }}>
          <DisplayTranslationData
            selectedTranslation={selectedTranslation}
            listOfNamespaces={LIST_OF_NAMESPACES}
          />
        </div>
      )}
      <div style={{ marginTop: '10px' }} />
      <button
        style={{ margin: '10px', backgroundColor: 'red' }}
        onClick={() =>
          deleteTranslationsFromFirestore(myFS, setAvailableTranslations)
        }
      >
        Delete Tranlation Data
      </button>
      <button
        style={{ margin: '10px' }}
        onClick={() => {
          setAvailableTranslations(null);
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default MainScreen;
