import { useState } from 'react';
import firebaseApp from './utils/firebase-config';
import AuthenticationScreen from './screens/AuthenticationScreen';
import LoadLanguagesScreen from './screens/LoadLanguageScreen.jsx';
import MainScreen from './screens/MainScreen.jsx';

const App = () => {
  const [availableTranslations, setAvailableTranslations] = useState();
  const [authUser, setAuthUser] = useState();

  if (!authUser) {
    // First, initialize Firebase & authenticate user
    return (
      <AuthenticationScreen
        setAuthUser={setAuthUser}
        firebaseApp={firebaseApp}
      />
    );
  } else if (!availableTranslations) {
    // Second, ensure Firestore has the translation data loaded into it
    return (
      <LoadLanguagesScreen
        firebaseApp={firebaseApp}
        setAvailableTranslations={setAvailableTranslations}
      />
    );
  } else {
    // Third, authenticated & have a data...so initialize i18next
    // & show the translations!
    return (
      <MainScreen
        authUser={authUser}
        firebaseApp={firebaseApp}
        availableTranslations={availableTranslations}
      />
    );
  }
};

export default App;
