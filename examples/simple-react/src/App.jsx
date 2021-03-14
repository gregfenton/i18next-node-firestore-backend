import { useState } from 'react';
import firebaseApp from './firebase-config.js';
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
    // Second, initialize i18next via Firestore
    return (
      <LoadLanguagesScreen
        firebaseApp={firebaseApp}
        setAvailableTranslations={setAvailableTranslations}
      />
    );
  } else {
    // Third, authenticated & have a language...so show data!
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
