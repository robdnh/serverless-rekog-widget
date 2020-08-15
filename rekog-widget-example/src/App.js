import React from "react";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import "./App.css";
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { ViewportProvider } from './ViewportProvider';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

const authConfig = {
  signInConfig: {
    isSignUpDisplayed: false
  }
};

function App(props) {

  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
  }, []);

  return authState === AuthState.SignedIn && user ? (
      <div className="AppContainer">
          <ViewportProvider>
            <Routes/>
          </ViewportProvider>
      </div>
  ) : (
    <div style={{ textAlign:"center", marginTop: '10%'}}>
      <AmplifyAuthenticator authConfig={ authConfig }>
        <AmplifySignIn slot="sign-in" ></AmplifySignIn>
      </AmplifyAuthenticator>
    </div>
  );
}

export default withRouter(App)