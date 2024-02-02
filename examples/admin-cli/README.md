# Example NodeJS/CLI use of `i18next-node-firestore-backend` with `firebase-admin`

This is a CLI-based example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore using the Firebase Admin SDK and display those values to the console.

## Requirements

- A Google Firebase project with Firestore enabled.  This app will work with a "Spark Plan" (free) project.
  > Note: The database must not be password protected. If you require authentication, you will need to modify app.js accordingly.

## Using the example

Following the information for [initializing the Admin SDK in non-Google environments](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments):
1. In the `Firebase Console` >> `Project Overview` >> `Project Settings` >> `Service Accounts`.
2. Click `Generate new private key`, then confirm by clicking `Generate key`.
3. Save the JSON file containing the key to the root of this project as `service-account.json`.
   ***Note***: the Service Account file is sensitive as it gives access to your Firebase project.
4. Review or edit the values in `.env`, especially the GOOGLE_APPLICATION_CREDENTIALS value.
5. To install required modules, run: `npm install`
6. To execute the example app, from the example's directory run: `npm run example`

## Outline of the example

The app's basic flow is:
1. Loads configuration from `.env`
1. Authenticates to Firebase and gets a connection to Firestore
1. Loads translation data (from `translations.js`) and uploads that data to Firestore into a collection `I18N_FIRESTORE_COLLECTION_NAME` defined in `.env`
1. Initializes i18next & the i18next-node-firestore-backend
1. Iterates over the set of translation keys, fetching translation values via i18next, which in turn is fetching the values from Firestore.
1. Exit.

## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend).  Many thanks for your contributions!
