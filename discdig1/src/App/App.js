import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

import Auth from '../Components/Auth/Auth';
import MyNavbar from '../Components/MyNavbar/MyNavbar';
import NewUser from '../Components/NewUser/NewUser';
import Home from '../Components/Home/Home';
import UserProfile from '../Components/UserProfile/UserProfile';

import fbConnect from '../Helpers/Data/fbConnection';

import './App.scss';
import userRequests from '../Helpers/Data/userRequests';

fbConnect();

const PublicRoute = ({ component: Component, authorized, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authorized === false ? <Component authorized={authorized}{...props} {...rest}/> : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />; 
};

const PrivateRoute = ({ component: Component, authorized, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authorized === true ? <Component authorized={authorized} {...props} {...rest}/> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const defaultUser = {
  id: 0,
  firstName: '',
  lastName: '',
  firebaseUid: '',
  avatarId: ''
};

class App extends React.Component {
  state = {
    userObj: defaultUser,
    authorized: false
  }

  componentDidMount () {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userRequests.getUserByFirebaseUid(user.uid)
        .then((userObj) => {
          this.setState({ authorized: true, userObj });
        })
        .catch(err => console.error(err))
      } else {
        this.setState({ authorized: false, userObj: defaultUser });
      }
    });
  };

  componentWillUnmount () {
    this.removeListener();
  };

  render() {
    const {authorized, userObj} = this.state;
    return (
      <div className="App">
      <Router>
        <MyNavbar authorized={ authorized } userObj={ userObj } userLoggedOut={ this.userLoggedOut }/>
          <Switch>
            <PublicRoute path='/auth' component={ Auth } authorized={ authorized }/>
            <PublicRoute path='/new-user' component={ NewUser } authorized={ authorized }/>
            <PrivateRoute path='/home' component={ Home } authorized={ authorized } userObj={ userObj }/>
            <PrivateRoute path='/profile' component={ UserProfile } authorized={ authorized } userObj={ userObj }/>
            <Redirect from='*' to='/auth'/>
          </Switch>
      </Router>
    </div>
    );
  }
 
}

export default App;
