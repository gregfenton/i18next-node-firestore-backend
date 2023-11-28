import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// Get these values from
//  Firebase Console
//    >> Project Overview
//    >> Project Settings
//    >> Your apps
//    >> (Web App or click "Add app" >> Web app)
//
const firebaseConfig = {
  apiKey: "A_______________________",
  authDomain: "YOUR_FIREBASE_PROJECT_NAME.firebaseapp.com",
  databaseURL: "https://YOUR_FIREBASE_PROJECT_NAME.firebaseio.com",
  projectId: "YOUR_FIRESBASE_PROJECT_NAME",
  storageBucket: "YOUR_FIRESBASE_PROJECT_NAME.appspot.com",
  appId: "1:_______________________:0",
};

// initialize the client app
const myApp = initializeApp(firebaseConfig);

// initialize Firestore in the client app
const myFS = getFirestore(myApp);

export default myFS;
