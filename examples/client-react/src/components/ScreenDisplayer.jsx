import { useState } from "react";
import { useAuthContext } from "../providers/AuthProvider";
import AuthenticationScreen from "../screens/AuthenticationScreen";
import LoadLanguageScreen from "../screens/LoadLanguageScreen";
import MainScreen from "../screens/MainScreen";

export const ScreenDisplayer = () => {
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
    return (
      <MainScreen
        availableTranslations={availableTranslations}
        setAvailableTranslations={setAvailableTranslations}
      />
    );
  }
};
