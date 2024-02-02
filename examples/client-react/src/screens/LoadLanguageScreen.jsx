import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useFirebaseContext } from '../providers/FirebaseProvider';
import { loadTranslationsToFirestore } from '../utils/firestore-i18n-utils';

export const LoadLanguageScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const setAvailableTranslations = props.setAvailableTranslations;

  const { myFS } = useFirebaseContext();

  let { VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID } = import.meta.env;

  // loads list of translations
  useEffect(() => {
    const getLanguages = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(myFS, VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID);
        let docSnap = await getDoc(docRef);

        console.log(`getting languages: ${docSnap.exists()}`);
        if (docSnap.exists()) {
          let data = docSnap.data();
          console.log(`getting languages: ${JSON.stringify(data)}`);
          setAvailableTranslations(data.translations);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getLanguages();
  }, [
    myFS,
    setAvailableTranslations,
    VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID,
  ]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }
  return (
    <div>
      <h1>Translations not yet loaded to Firestore</h1>
      <p>
        [Translations list not found at Firestore collection path:{' '}
        <em style={{ color: 'darkgreen' }}>
          {VITE_I18N_FIRESTORE_TRANSLATION_LIST_DOC_ID}
        </em>
        ]
      </p>
      <button
        onClick={() =>
          loadTranslationsToFirestore(myFS, setAvailableTranslations)
        }
      >
        Load Languages
      </button>
    </div>
  );
};

export default LoadLanguageScreen;
