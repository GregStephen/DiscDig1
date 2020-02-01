import React from 'react';
import { Link } from 'react-router-dom';

import './Auth.scss';

class Auth extends React.Component {
  state = {
    email: '',
    password: '',
    errorMsg: ''
  }

  componentDidUpdate({ error }) {
    if (this.props.error !== error) {
      this.setState({ errorMsg: this.props.error });
    }
  };

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
    const { email, password, errorMsg } = this.state;
    return (
      <div className="Auth">
        <div className="container">
          <div className="page row">
            <div className="welcome col-12 col-md-6 row justify-content-center">
              <h2 className="welcome-header">Welcome to DiscDig!</h2>
              <p className="welcome-text">Start searching thru records and add to your own collection</p>
              <p className="welcome-text">Create subcollections for personal favorites or albums for a certain mood</p>
              <Link className="btn btn-info col-8" to={'/new-user'}>Create an Account!</Link>
            </div>
            <form className="col-10 col-lg-4 sign-in-form" onSubmit={this.logIntoDiscDig}>
              <h3 className="sign-in-header">Already Have An Account?</h3>
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
              <p className="error">{errorMsg}</p>
            </form>
          </div>
        </div>
      </div>
    )
  }
};

export default Auth;