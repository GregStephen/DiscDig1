import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import {
  Form, Label, Input, Button,
} from 'reactstrap';

import AvatarSelectionButton from '../AvatarSelectionButton/AvatarSelectionButton';

import avatarRequests from '../../Helpers/Data/avatarRequests';
import userRequests from '../../Helpers/Data/userRequests';

import './NewUser.scss';

const defaultNewUser = {
  firstName: '',
  lastName: '',
  avatarId: ''
};

class NewUser extends React.Component {
  state = {
    newUser: defaultNewUser,
    avatars: [],
    email: '',
    password: '',
    error: ''
  };

  componentDidMount() {
    // sets state of all avatars from db
    avatarRequests.getAllAvatars()
      .then(avatars => this.setState({ avatars }))
      .catch(err => console.error('trouble getting avatars', err));
  };


  // puts border on selected avatar and sets it to state
  selectAvatar = (e) => {
    e.preventDefault();
    const avatarSelection = $('.avatar-btn');
    for (let i = 0; i < avatarSelection.length; i += 1) {
      avatarSelection[i].classList.remove('selected');
    }
    e.currentTarget.classList.add('selected');
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.name;
    this.setState({ newUser: tempUser });
  }

  // sets state for new user info
  formFieldStringState = (e) => {
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ newUser: tempUser });
  };

  // sets state for firebase info
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { logIn } = this.props;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        cred.user.getIdToken()
        .then(token => sessionStorage.setItem('token', token))
        const saveMe = { ...this.state.newUser };
        saveMe.firebaseUid = firebase.auth().currentUser.uid;
        userRequests.addNewUser(saveMe)
          .then(() => logIn(email, password))
          .catch(err => console.error('unable to save', err));
      })
      .catch(err => this.setState({ error: err.message }));
  }

  render() {
    const {
      newUser, email, password, error, avatars
    } = this.state;

    const showAvatars = avatars.map((avatar, index) => (
      <AvatarSelectionButton
      avatar={ avatar }
      index={ index }
      selectAvatar={ this.selectAvatar }
      key={ avatar.id }
      />
    ))

    return (
      <div className="NewUser container">
        <div className="new-user-form">
        <h1 className="join-header">Create an account!</h1>
          <Form className="row justify-content-center" onSubmit={this.formSubmit}>
            <div className="form-group col-11 col-md-6 col-lg-4">
              <Label for="firstName">First Name</Label>
              <Input
              type="text"
              className="form-control"
              id="firstName"
              value={newUser.firstName}
              onChange={this.formFieldStringState}
              placeholder="John"
              required
              />
            </div>
            <div className="form-group col-11 col-md-6 col-lg-4">
              <Label for="lastName">Last Name</Label>
              <Input
              type="text"
              className="form-control"
              id="lastName"
              value={newUser.lastName}
              onChange={this.formFieldStringState}
              placeholder="Smith"
              required
              />
            </div>
            <div className="form-group col-11 col-md-9 col-lg-8">
              <Label for="email">Email</Label>
              <Input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={this.handleChange}
              placeholder="John@DiscDig.com"
              required
              />
            </div>
            <div className="form-group col-11 col-md-9 col-lg-8">
              <Label for="password">Password</Label>
              <Input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={this.handleChange}
              required
              />
            </div>
            <div className="form-group col-12 row justify-content-center">
              <p className="avatar-select-header col-12">Select Your Avatar</p>
              <div className="row col-10 justify-content-around">
                { showAvatars }
              </div>
            </div>
            <h2 className="error col-12">{error}</h2>
            <Button type="submit" className="new-user-btn btn btn-success btn-lg">Get Diggin'</Button>
          </Form>
        </div>
      </div>
    )
  }
};

export default NewUser;
