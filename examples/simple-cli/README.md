# Example NodeJS/CLI use of `i18next-node-firestore-backend`

This is a CLI-based example of using i18next & i18next-node-firestore-backend to fetch translations from Firestore and display them to the console.

## Requirements

- A Google Firebase project with Firestore enabled.  This app will work with a "Spark Plan" (free) project.
  > Note: The database must not be password protected. If you require authentication, you will need to modify app.js accordingly.

## Using the example

1. Edit the values in `.env`, especially the FIREBASE values.  You get the values for your Firebase Project from Firebase Console >> Project Overview >> Project Settings >> Your apps >> (Web App or click "Add app" >> Web app)
2. To get needed modules, run: `npm install`
3. To run the example app, from root directory run: `npm run example`

## Outline of the example

The app's basic flow is:
1. Loads configuration from `.env`
1. Authenticates to Firebase and gets a connection to Firestore.
1. Loads translation data (from `tranlations.js`) and uploads that data to Firestore.
1. Initializes i18next & the i18next-node-firestore-backend
1. Iterates over the set of translation keys, fetching translation values via i18next, which in turn is fetching the values from Firestore.
1. Exit.

## Acknowledgements

This project began as a copy of `i18next-node-mongodb-backend` (https://github.com/lamualfa/i18next-node-mongo-backend).  Many thanks for your contributions!