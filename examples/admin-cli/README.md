# Example NodeJS/CLI use of `i18next-node-firestore-backend` with `firebase-admin`

This is a CLI-based example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore using the Firebase Admin SDK and display those values to the console.

## Requirements

- A Google Firebase project with Firestore enabled.  This app will work with a "Spark Plan" (free) project.
  > Note: The database must not be password protected. If you require authentication, you will need to modify app.js accordingly.

## Using the example with published NPM package

Following the information for [initializing the Admin SDK in non-Google environments](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments):
1. In the `Firebase Console` >> `Project Overview` >> `Project Settings` >> `Service Accounts`.
1. Click `Generate new private key`, then confirm by clicking `Generate key`.
1. Save the JSON file containing the key to the root of this project as `service-account.json`.
   ***Note***: the Service Account file is sensitive as it gives access to your Firebase project.
1. Review or edit the values in `.env`, especially the GOOGLE_APPLICATION_CREDENTIALS value.
1. To install required modules, run: `npm install`
1. To execute the example app, from the example's directory run: `npm run example`

## Using the example with local NPM code

1. Run `npm uninstall i18next-node-firestore-backend` to remove the published NPM package.
1. Run `npm install i18next-node-firestore-backend@file:///../../dist` to install the local NPM package.
1. To execute the example app, from the example's directory run: `npm run example`

NOTE: remember to revert the changes to `examples/admin-cli/package.json` before committing.

## Outline of the example

The app's basic flow is:
1. Loads configuration from `.env`
1. Authenticates to Firebase and gets a connection to Firestore
1. Loads translation data (from `translations.js`) and uploads that data to Firestore into a collection `I18N_FIRESTORE_COLLECTION_NAME` defined in `.env`
1. Initializes i18next & the i18next-node-firestore-backend
1. Iterates over the set of translation keys, fetching translation values via i18next, which in turn is fetching the values from Firestore.
1. Exit.

## Understanding the example

The main configuration for `i18next-node-firestore-backend` is in `app.js`.  Initialization is done with the following options. See the full code for definitions of the various constants used.

```js
/**
 * The options to initialize i18next-node-firestore-backend plugin
 */
const MY_I18N_FIRESTORE_BACKEND_OPTS = {
  firestore: fsDB,
  // we are using the namespaced Admin SDK, so pass the modular functions
  firestoreModule: { isModular: false },
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
