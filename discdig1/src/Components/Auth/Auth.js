import React from 'react';
import { Link } from 'react-router-dom';

import './Auth.scss';

class Auth extends React.Component {
  render() {
    return (
      <div className="Auth">
        <h1>Auth Page</h1> 
        <Link className="btn btn-info col-8" to={'/new-user'}>Create an Account!</Link>
      </div>
    )
  }
};

export default Auth;