import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import './App.css';

const App = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState('');
  const [responseClassName, setResponseClassName] = useState('');

  const getResource = async () => {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });

    fetch(process.env.REACT_APP_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setResponse('Backend call successful');
          setResponseClassName('success');
        } else {
          setResponse('Backend call failed: ' + response.statusText);
          setResponseClassName('failure');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="app">
      {isAuthenticated ? (
        <div className="auth-app-section">
          <div className="user-section">
            Hello {user.name} <button onClick={logout}>Log out</button>
          </div>
          <div className="resource-section">
            Get request to the resource endpoint <button onClick={getResource}>Get Resource</button>
          </div>
          <div className={`response-section ${responseClassName}-response`}>{response}</div>
        </div>
      ) : (
        <button className="login-btn" onClick={loginWithRedirect}>
          Log in
        </button>
      )}
    </div>
  );
};

export default App;
