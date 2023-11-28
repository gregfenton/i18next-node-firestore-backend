import { createContext, useContext, useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export const FirebaseContext = createContext({});

const firebaseConfig = {
  // YOUR FIREBASE APP CONFIG
  //
  // Get this values from:
  //   Log into Firebase Console (https://console.firebase.google.com/)
  //      >> YOUR_PROJECT
  //      >> Project Settings
  //      >> Choose an existing app or add new one (Add App >> Web app)
  //      >> Firebase SDK snippet
  //      >> Config
  apiKey: 'A_______________________',
  authDomain: 'YOUR_FIREBASE_PROJECT_NAME.firebaseapp.com',
  databaseURL: 'https://YOUR_FIREBASE_PROJECT_NAME.firebaseio.com',
  projectId: 'YOUR_FIRESBASE_PROJECT_NAME',
  storageBucket: 'YOUR_FIRESBASE_PROJECT_NAME.appspot.com',
  appId: '1:_______________________:0',
};

const FirebaseProvider = (props) => {
  const { children } = props;

  const [firebaseInitializing, setFirebaseInitializing] = useState(true);
  const [usingEmulators, setUsingEmulators] = useState(false);
  const [emulatorsConfig, setEmulatorsConfig] = useState(false);

  const myApp = initializeApp(firebaseConfig);
  const myAuth = getAuth(myApp);
  const myFS = getFirestore(myApp);

  useEffect(() => {
    const shouldUseEmulator = false; // or true :)

    if (shouldUseEmulator) {
      let mapEmulators = {};

      let FS_HOST = 'localhost';
      let FS_PORT = 5002;

      if (FS_HOST && FS_PORT) {
        connectFirestoreEmulator(myFS, FS_HOST, FS_PORT);
        console.log(`firestore().useEmulator(${FS_HOST}, ${FS_PORT})`);
        mapEmulators.FS_HOST = FS_HOST;
        mapEmulators.FS_PORT = FS_PORT;
      }

      let AUTH_HOST = 'localhost';
      let AUTH_PORT = 9099; // or whatever you set the port to in firebase.json
      if (AUTH_HOST && AUTH_PORT) {
        let AUTH_URL = `http://${AUTH_HOST}:${AUTH_PORT}`;
        console.log(
          `connectAuthEmulator(${AUTH_URL}, {disableWarnings: true})`
        );
        //    warns you not to use any real credentials -- we don't need that noise :)
        connectAuthEmulator(myAuth, AUTH_URL, { disableWarnings: true });

        mapEmulators.AUTH_HOST = AUTH_HOST;
        mapEmulators.AUTH_PORT = AUTH_PORT;
        mapEmulators.AUTH_URL = AUTH_URL;
      }

      setUsingEmulators(true);
      setEmulatorsConfig(mapEmulators);

      console.log(
        'FIREBASE STARTUP: using Firebase emulator:',
        JSON.stringify(mapEmulators, null, 2)
      );
    }

    setFirebaseInitializing(false);
  }, [myAuth, myFS]);

  if (firebaseInitializing) {
    return <h1>Loading</h1>;
  }

  const theValues = {
    emulatorsConfig,
    myApp,
    myAuth,
    myFS,
    usingEmulators,
  };

  return (
    <FirebaseContext.Provider value={theValues}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * A hook that returns the FirebaseContext's values.
 *
 * @returns {Object} - an object with the following properties:
 * - `emulatorsConfig` {object} - configuration for the emulators if `usingEmulators` is true
 * - `myApp` {object} - the Firebase app instance
 * - `myAuth` {object} - the Auth instance
 * - `myFS` {object} - the Firestore instance
 * - `myStorage` {object} - the Cloud Storage instance
 * - `usingEmulators` {boolean} - true if using emulators, false otherwise
 */
const useFirebaseContext = () => {
  // get the context
  const context = useContext(FirebaseContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useFirebaseContext was used outside of its Provider');
  }

  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { FirebaseProvider, useFirebaseContext };
