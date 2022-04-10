# Example React app using `i18next-node-firestore-backend`

This is a React-based example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore and display them to the console.

## Requirements

- A Google Firebase project with Firestore enabled and at least one user account in Firebase Authentication with email/password.  This app will work with a "Spark Plan" (free) project.

## Usage

- Ensure values in `src/utils/firebase-config.js` are correct for your Firebase project.  You get those values from Firebase Console >> Project Overview >> Project Settings >> Your apps >> (Web App or click "Add app" >> Web app)
- Ensure values in `.env` are correct.  As is, they relate to the structure of the data in `translations.js` and what the React app is expecting to display those translations.
- To get needed modules, run: `npm install`
- From root directory, run: `npm start`

## Outline of the example

The app's basic flow is:
1. Loads configuration from `.env`
1. AUTHENTICATION SCREEN: displays a UI to authenticate to your Firebase project.
1. LOAD LANGUAGES SCREEN: checks if Firestore has translations already in it.  If so, jumps straight to next screen.  If not, presents a button to the user that when clicked loads translation data (from `tranlations.js`) to Firestore into a collection `I18N_FIRESTORE_COLLECTION_NAME` defined in `.env`
1. MAIN SCREEN:
   - initializes i18next & the i18next-node-firestore-backend
   - displays a "language picker" so the user can change languages
   - iterates over the set of translation keys, fetching translation values via i18next for the currently selected language, which in turn is fetching the values from Firestore, and displays the value in an HTML table.

## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend).  Many thanks for your contributions!
