import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useEffect, useState } from 'react';

import { useFirebaseContext } from '../providers/FirebaseProvider';

export const AuthenticationScreen = (props) => {
  let setAuthUser = props.setAuthUser;
  const { myAuth } = useFirebaseContext();

  const [loginFailedMessage, setLoginFailedMessage] = useState();

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      // since Firebase v9 and above service are imported when needed instad of being a namespace
      new firebaseui.auth.AuthUI(myAuth);

    ui.start('#firebaseui-auth-container', {
      signInSuccessUrl: '/home',
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
        // Other sign-in providers if desired...
      ],
      callbacks: {
        signInFailure: function (error) {
          setLoginFailedMessage('Login Failed: ' + error.message);
          console.error('Login Failed', error);
          return false;
        },
      },
    });
  }, [myAuth, setAuthUser]);

  return (
    <div>
      <h1>Welcome to My Awesome App</h1>
      <div id='firebaseui-auth-container'></div>
      {loginFailedMessage && (
        <span style={{ color: 'red' }}>{loginFailedMessage}</span>
      )}
    </div>
  );
};

export default AuthenticationScreen;
