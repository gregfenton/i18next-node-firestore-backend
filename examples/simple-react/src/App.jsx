import { useState } from 'react';
import { AuthProvider, useAuthContext } from './providers/AuthProvider.jsx';
import { FirebaseProvider } from './providers/FirebaseProvider.jsx';
import { AuthenticationScreen } from './screens/AuthenticationScreen';
import { LoadLanguageScreen } from './screens/LoadLanguageScreen.jsx';
import { MainScreen } from './screens/MainScreen.jsx';

const ScreenDisplayer = () => {
  const [availableTranslations, setAvailableTranslations] = useState();

  const { user } = useAuthContext();
  if (!user) {
    // First, initialize Firebase & authenticate user
    return <AuthenticationScreen />;
  } else if (!availableTranslations) {
    // Second, ensure Firestore has the translation data loaded into it
    return (
      <LoadLanguageScreen setAvailableTranslations={setAvailableTranslations} />
    );
  } else {
    // Third, authenticated & have a data...so initialize i18next
    // & show the translations!
    return <MainScreen availableTranslations={availableTranslations} />;
  }
};

const App = () => {
  return (
    <div className='div-app'>
      <FirebaseProvider>
        <AuthProvider>
          <ScreenDisplayer />
        </AuthProvider>
      </FirebaseProvider>
    </div>
  );
};

export default App;
