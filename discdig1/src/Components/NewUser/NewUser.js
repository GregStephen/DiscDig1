import React from 'react';
import 'firebase/auth';
import $ from 'jquery';
import {
  Form, Label, Input, Button,
} from 'reactstrap';

import avatarRequests from '../../Helpers/Data/avatarRequests';

import './NewUser.scss';

const defaultNewUser = {
  firstName: '',
  lastName: '',
  imgUrl: ''
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
    avatarRequests.getAllAvatars()
      .then(avatars => this.setState({ avatars }))
      .catch(err => console.error('trouble getting avatars', err));
  };

  selectAvatar = (e) => {
    e.preventDefault();
    const avatarSelection = $('.avatar-image');
    for (let i = 0; i < avatarSelection.length; i += 1) {
      avatarSelection[i].classList.remove('selected');
    }
    e.target.classList.add('selected');
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.name;
    this.setState({ newUser: tempUser });
  }

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.newUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ newUser: tempUser });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    const {
      newUser, email, password, error, avatars
    } = this.state;

    const showAvatars = avatars.map((avatar, index) => (
      <div key={avatar.id} className="avatar col-6 col-md-4 col-lg-3 mb-4">
      <button className="avatar-btn"><img id='imageUrl' name={avatar.id} className={ index === 0 ? 'avatar-image selected' : 'avatar-image'} src={avatar.imgUrl} alt={avatar.name} onClick={this.selectAvatar}></img></button>
      </div>
    ))
    return (
      <div className="NewUser container">
        <h1 className="join-header">Create an account!</h1>
        <Form className="row justify-content-center new-user-form" onSubmit={this.formSubmit}>
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
    )
  }
};

export default NewUser;
