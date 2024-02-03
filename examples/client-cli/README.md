# Example NodeJS/CLI use of `i18next-node-firestore-backend` with `firebase`

This is a CLI-based example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore using the Firebase Web Client SDK and display those values to the console.

## Requirements

- A Google Firebase project with Firestore enabled.  This app will work with a "Spark Plan" (free) project.
  > Note: The database must not be password protected. If you require authentication, you will need to modify app.js accordingly.

## Using the example

1. Make a copy of the file `.env.example` and name it `.env`
1. Edit the new file `.env`, setting the following to the values of your Firebase Project from: `Firebase Console` >> `Project Overview` >> `Project Settings` >> `Your apps` >> (`Web App` or click `Add app` >> `Web app`).  In `.env` set the values of:
   ```
   FIREBASE_APIKEY=
   FIREBASE_AUTHDOMAIN=
   FIREBASE_DATABASEURL=
   FIREBASE_PROJECTID=
   FIREBASE_APPID=
   ```
1. Use an existing user or create a new user in your Firebase project's Authentication. Set the user's email and password in `.env`:
   ```
   USER_EMAIL=
   USER_PASSWORD=
   ```
1. To install required modules, run: `npm install`
1. To execute the example app, from the example's directory run: `npm run example`

## Outline of the example

The app's basic flow is:
1. Loads configuration from `.env`
1. Authenticates to Firebase and gets a connection to Firestore
1. Loads translation data (from `translations.js`) and uploads that data to Firestore into a collection `I18N_FIRESTORE_COLLECTION_NAME` defined in `.env`
1. Initializes i18next & the i18next-node-firestore-backend
1. Iterates over the set of translation keys, fetching translation values via i18next, which in turn is fetching the values from Firestore.
1. Exit.

## Understanding the example

The main configuration for `i18next-node-firestore-backend` is in `app.js`.  Initialization is done with the following options.  See the full code for definitions of the various constants used.

```js
/**
 * The options to initialize i18next-node-firestore-backend plugin
 */
const MY_I18N_FIRESTORE_BACKEND_OPTS = {
  firestore: fsDB,
  // we are using the modular Firestore SDK, so pass the modular functions
  firestoreModule: {
    isModular: true,
    functions: { collection, query, where, getDocs },
  },
  collectionName: I18N_FIRESTORE_COLLECTION_NAME,
  languageFieldName: I18N_LANGUAGE_FIELD_NAME,
  namespaceFieldName: I18N_NAMESPACE_FIELD_NAME,
  dataFieldName: I18N_DATA_FIELD_NAME,
  debug: false, // debug i18next-node-firestore-backend
};
/**
 * The options to initialize i18next
 */
const MY_I18N_OPTS = {
  fallbackLng: 'en',
  ns: LIST_OF_NAMESPACES,
  debug: false, // debug i18next
  backend: MY_I18N_FIRESTORE_BACKEND_OPTS,
};
```

## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend).  Many thanks for your contributions!
