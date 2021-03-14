import React, { useState } from 'react';

import * as firebaseui from 'firebaseui';

const AuthenticationScreen = (props) => {
  let setAuthUser = props.setAuthUser;
  let firebaseApp = props.firebaseApp;

  const [loginFailedMessage, setLoginFailedMessage] = useState();

  let ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebaseApp.auth());

  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      {
        provider: firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      // Other sign-in providers if desired...
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        setAuthUser(authResult.user);
        return true;
      },
      signInFailure: function (error) {
        setLoginFailedMessage('Login Failed');
        return false;
      },
    },
  });

  return (
    <div>
      <h1>Welcome to My Awesome App</h1>
      <div id='firebaseui-auth-container'></div>
      <div id='loader'>Loading...</div>
      {loginFailedMessage && (
        <span style={{ color: 'red' }}>{loginFailedMessage}</span>
      )}
    </div>
  );
};

export default AuthenticationScreen;
