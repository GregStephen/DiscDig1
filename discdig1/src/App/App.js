import React from 'react';
import {
  BrowserRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

import AddAlbumPage from '../Components/AddAlbumPage/AddAlbumPage';
import AlbumPage from '../Components/AlbumPage/AlbumPage';
import Auth from '../Components/Auth/Auth';
import Home from '../Components/Home/Home';
import MyNavbar from '../Components/MyNavbar/MyNavbar';
import NewUser from '../Components/NewUser/NewUser';
import Subcollections from '../Components/Subcollections/Subcollections';
import UserProfile from '../Components/UserProfile/UserProfile';

import userRequests from '../Helpers/Data/userRequests';
import collectionRequests from '../Helpers/Data/collectionRequests';

import fbConnect from '../Helpers/Data/fbConnection';

import './App.scss';


fbConnect();

const PublicRoute = ({ component: Component, authorized, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authorized === false ? <Component authorized={authorized}{...props} {...rest} /> : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PrivateRoute = ({ component: Component, authorized, ...rest }) => {
  // props contains Location, Match, and History
  const routeChecker = props => (authorized === true ? <Component authorized={authorized} {...props} {...rest} /> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const defaultUser = {
  id: 0,
  firstName: '',
  lastName: '',
  firebaseUid: '',
  avatar: {
    imgUrl: '',
    name: ''
  }
};

class App extends React.Component {
  state = {
    userObj: defaultUser,
    authorized: false,
    collections: []
  }


  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      } else {
        this.setState({ authorized: false, userObj: defaultUser });
      }
    });
  };

  componentWillUnmount() {
    this.removeListener();
  };

  logIn = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(cred => cred.user.getIdToken())
      .then(token => sessionStorage.setItem('token', token))
      .then(() => userRequests.getUserByFirebaseUid(firebase.auth().currentUser.uid))
      .then((userObj) => {
        this.getAllUsersCollections(userObj)
        this.setState({ userObj })
      })
      .catch(err => this.setState({ error: err.message }))
  };

  getAllUsersCollections = (userObj) => {
    collectionRequests.getAllUsersCollectionsByUserId(userObj.id)
      .then((result) => {
        this.setState({ collections: result }, () => this.setState({ authorized: true}))
      })
      .catch(err => console.error(err));
  };

  refreshUserObj = () => {
    const { userObj } = this.state;
    userRequests.getUserById(userObj.id)
      .then((refreshedUserObj) => {
        this.setState({ userObj: refreshedUserObj })
      })
      .catch(err => console.error(err));
  }

  deleteSub = (subId) => new Promise((resolve, reject) => {
    const { userObj } = this.state;
    collectionRequests.deleteThisSubcollection(subId)
      .then(() => {
        this.getAllUsersCollections(userObj)
        resolve('deleted')
      })
      .catch(err => reject(err));
  })

  createNewSubColl = (toSend) => new Promise((resolve, reject) => {
    const { userObj } = this.state;
    collectionRequests.addNewSubcollection(toSend)
      .then(() => {
        this.getAllUsersCollections(userObj)
        resolve('created');
      })
      .catch(err => reject(err));
  });

  changeSubName = (subObj) => new Promise((resolve, reject) => {
    const { userObj } = this.state;
    collectionRequests.changeSubName(subObj)
      .then(() => {
        this.getAllUsersCollections(userObj)
        resolve('changed name');
      })
      .catch(err => reject(err));
  });

  deleteThisUser = () => {
    const { userObj } = this.state;
    userRequests.deleteUser(userObj.id)
      .then(() => {
        var user = firebase.auth().currentUser;
        user.delete().then(function () {
          // bye bitch.
        }).catch(function (error) {
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

  changeThisAvatar = (changedAvater) => {
    userRequests.changeAvatar(changedAvater)
      .then(() => this.refreshUserObj())
      .catch(err => console.error(err));
  }

  addThisAlbumToMain = (albumToAdd) => new Promise((resolve, reject) => {
    const { userObj } = this.state;
    collectionRequests.addAlbumToMainCollection(albumToAdd)
      .then(() => {
        resolve('added');
        this.getAllUsersCollections(userObj)
      })
      .catch(err => reject(err))
  });

  deleteAllTheseAlbums = (obj) => new Promise((resolve, reject) => {
    const { userObj } = this.state;
    collectionRequests.deleteTheseAlbumsFromCollection(obj)
      .then(() => {
        resolve('deleted');
        this.getAllUsersCollections(userObj)
      })
      .catch(err => reject(err))
  })

  addSelectedAlbumsToSubCollection = (objToAdd) => {
    const { userObj } = this.state;
    collectionRequests.addAlbumsToSubcollection(objToAdd)
      .then(() => this.getAllUsersCollections(userObj))
      .catch(err => console.error(err));
  };

  render() {
    const { authorized, userObj, collections, error } = this.state;
    return (
      <div className="App">
        <Router>
          <MyNavbar authorized={authorized} userObj={userObj} userLoggedOut={this.userLoggedOut} />
          <Switch>
            <PublicRoute path='/auth' component={Auth} authorized={authorized} logIn={this.logIn} error={error} />
            <PublicRoute path='/new-user' component={NewUser} authorized={authorized} logIn={this.logIn} error={error} />
            <PrivateRoute path='/home' component={Home} authorized={authorized} userObj={userObj} collections={collections} deleteAllTheseAlbums={this.deleteAllTheseAlbums} addSelectedAlbumsToSubCollection={this.addSelectedAlbumsToSubCollection} />
            <PrivateRoute path='/profile' component={UserProfile} authorized={authorized} userObj={userObj} deleteThisUser={this.deleteThisUser} editThisUser={this.editThisUser} changeThisAvatar={this.changeThisAvatar} collections={collections} />
            <PrivateRoute path='/add-album' component={AddAlbumPage} authorized={authorized} userObj={userObj} addThisAlbumToMain={this.addThisAlbumToMain} collections={collections} />
            <PrivateRoute path='/album/:id' component={AlbumPage} authorized={authorized} userObj={userObj} />
            <PrivateRoute path='/subcollections' component={Subcollections} authorized={authorized} userObj={userObj} collections={collections} deleteSub={this.deleteSub} createNewSubColl={this.createNewSubColl} changeSubName={this.changeSubName} />
            <Redirect from='*' to='/auth' />
          </Switch>
        </Router>
      </div>
    );
  }

}

export default App;
