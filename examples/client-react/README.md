# Example ReactJS/Vite use of `i18next-node-firestore-backend` with `firebase`

This is a ReactJS/Vite example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore using the Firebase Web Client SDK and display those values to the console.

## Requirements

- A Google Firebase project with Firestore enabled. This app will work with a "Spark Plan" (free) project.
  > Note: The database must not be password protected. If you require authentication, you will need to modify app.js accordingly.

## Using the example

1. Edit the FIREBASE values in `src/providers/FirebaseProvider.jsx`. Get the values of your Firebase Project from: `Firebase Console` >> `Project Overview` >> `Project Settings` >> `Your apps` >> (`Web App` or click `Add app` >> `Web app`). In `FirebaseProvider.jsx` set the values of `firebaseConfig`
1. To install required modules, run: `npm install`
1. To execute the example app, from the example's directory run: `npm run dev`

## Outline of the example

The app's basic flow is:

1. Loads configuration from `FirebaseProvider.jsx` and connects to Firebase
1. Uses a Login Screen (Firebase UI) to authenticate the user
1. Attempts to fetch the translations using `<LoadLanguageScreen>` from Firestore using i18next ; if they load shows the values on `<MainScreen>`, otherwise remains on `<LoadLanguageScreen>` for you to load the translations.

## Understanding the example

The main configuration for `i18next-node-firestore-backend` is in `scr/screens/MainScreen.jsx`. Initialization is done with the following options. See the full code for definitions of the various constants used.

```js
/**
 * The options to initialize i18next-node-firestore-backend plugin
 */
const MY_I18N_FIRESTORE_OPTS = {
  firestore: myFS,
  // pass the Firestore functions to the backend plugin
  firestoreModule: {
    isModule: true,
    functions: { collection, getDocs, query, where },
  },
  collectionName: VITE_I18N_FIRESTORE_COLLECTION_NAME,
  languageFieldName: VITE_I18N_LANGUAGE_FIELD_NAME,
  namespaceFieldName: VITE_I18N_NAMESPACE_FIELD_NAME,
  dataFieldName: VITE_I18N_DATA_FIELD_NAME,
  debug: true, // debug i18next-node-firestore-backend
};
/**
 * The options to initialize i18next
 */
const MY_I18N_OPTS = {
  fallbackLng: 'en',
  ns: LIST_OF_NAMESPACES,
  debug: false, // debug i18next
  firestoreOpts: MY_I18N_FIRESTORE_OPTS,
  load: 'currentOnly', // don't auto-load other langs (en vs. en-US)
  interpolation: {
    escapeValue: false, // not needed for react
  },
  react: {
    useSuspense: false, // <---- this will do the magic
  },
};
```
## Known Issues

As of v2.0.0, the React app gets an error message logged to the JS console in the browser when using `isModular: true`.  The error message is:
```
FirebaseError: Function collection() cannot be called with an empty path.
```


## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend). Many thanks for your contributions!
