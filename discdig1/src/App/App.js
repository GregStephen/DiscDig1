import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';

import Auth from '../Components/Auth/Auth';
import MyNavbar from '../Components/MyNavbar/MyNavbar';
import NewUser from '../Components/NewUser/NewUser';
import Home from '../Components/Home/Home';

import fbConnect from '../Helpers/Data/fbConnection';

import './App.scss';

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
            <Redirect from='*' to='/auth'/>
          </Switch>
      </Router>
    </div>
    );
  }
 
}

export default App;
