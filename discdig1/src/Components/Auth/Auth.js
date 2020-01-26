import React from 'react';
import { Link } from 'react-router-dom';

import './Auth.scss';

class Auth extends React.Component {
  state = {
    email: '',
    password: '',
    error: ''
  }

  logIntoDiscDig = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const {logIn} = this.props;
    logIn(email, password);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };


  render() {
    const { email, password } = this.state;
    const {error} = this.props;
    return (
      <div className="Auth">
        <h1>Auth Page</h1> 
        <Link className="btn btn-info col-8" to={'/new-user'}>Create an Account!</Link>
        <form className="col-10 col-lg-4 container sign-in-form" onSubmit={this.logIntoDiscDig}>
            <h3 className="sign-in-header">All Ready Have An Account?</h3>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={this.handleChange}
              placeholder="John@DiscDig.com"
              required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={this.handleChange}
              required
              />
            </div>
            <button type="submit" className="btn btn-success">Log In</button>
            <p className="error">{error}</p>
          </form>
      </div>
    )
  }
};

export default Auth;