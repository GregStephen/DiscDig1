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
import AddAlbumPage from '../Components/AddAlbumPage/AddAlbumPage';
import Subcollections from '../Components/Subcollections/Subcollections';

import userRequests from '../Helpers/Data/userRequests';
import collectionRequests from '../Helpers/Data/collectionRequests';

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
    authorized: false,
    collections: []
  }

  componentDidMount () {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userRequests.getUserByFirebaseUid(user.uid)
        .then((userObj) => {
            collectionRequests.getAllUsersCollectionsByUserId(userObj.id)
            .then((result) => {
              this.setState({ collections: result })})
            .catch(err => console.error(err));
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

  refreshUserObj = () => {
    const {userObj} = this.state;
    userRequests.getUserById(userObj.id)
      .then((refreshedUserObj) => {
        this.setState({ userObj : refreshedUserObj })
      })
      .catch(err => console.error(err));
  }

  deleteThisUser = () => {
    const {userObj} = this.state;
    userRequests.deleteUser(userObj.id)
      .then(() => {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
          // bye bitch.
        }).catch(function(error) {
          console.error(error)
        });
      })
      .catch(err => console.error(err));
  };

  editThisUser = (userToEdit) => {
    userRequests.editUser(userToEdit)
      .then(() => {
        this.refreshUserObj();
      })
      .catch(err => console.error(err));
  };

  render() {
    const {authorized, userObj, collections} = this.state;
    return (
      <div className="App">
      <Router>
        <MyNavbar authorized={ authorized } userObj={ userObj } userLoggedOut={ this.userLoggedOut }/>
          <Switch>
            <PublicRoute path='/auth' component={ Auth } authorized={ authorized }/>
            <PublicRoute path='/new-user' component={ NewUser } authorized={ authorized }/>
            <PrivateRoute path='/home' component={ Home } authorized={ authorized } userObj={ userObj } collections={collections}/>
            <PrivateRoute path='/profile' component={ UserProfile } authorized={ authorized } userObj={ userObj } deleteThisUser={ this.deleteThisUser } editThisUser={ this.editThisUser } collections={collections}/>
            <PrivateRoute path='/add-album' component={ AddAlbumPage } authorized={ authorized } userObj={ userObj }/>
            <PrivateRoute path='/subcollections' component={ Subcollections } authorized={ authorized } userObj={ userObj }/>
            <Redirect from='*' to='/auth'/>
          </Switch>
      </Router>
    </div>
    );
  }
 
}

export default App;
