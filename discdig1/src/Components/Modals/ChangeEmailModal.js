import React from 'react';
import {
  Button, ModalBody, ModalFooter, FormGroup, Form, Label, Input,
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';


class ChangeEmailModal extends React.Component {
  state = {
    updatedEmail: {
      password: '',
      newEmail: '',
    },
    error: '',
  };

  static propTypes = {
    userObj: PropTypes.object.isRequired,
    toggleModalOpen: PropTypes.func,
  };

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  reauthenticate = (currentPassword) => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword,
    );
    return user.reauthenticateWithCredential(cred);
  };

  changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      const user = firebase.auth().currentUser;
      user.updateEmail(newEmail)
        .then(() => {
          this.toggleModal();
          // maybe alert them somehow that their email change was successful
        }).catch((error) => { this.setState({ error: error.message }); });
    }).catch((error) => {
      if (error.code === 'auth/wrong-password') {
        this.setState({ error: 'Password is not correct' });
      }
    });
  }

  formSubmit = (e) => {
    e.preventDefault();
    const { updatedEmail } = this.state;
    this.changeEmail(updatedEmail.password, updatedEmail.newEmail);
  };

  formFieldStringState = (e) => {
    const tempEmailChange = { ...this.state.updatedEmail };
    tempEmailChange[e.target.id] = e.target.value;
    this.setState({ updatedEmail: tempEmailChange });
  };

  render() {
    const { updatedEmail, error } = this.state;
    return (
      <div className='ChangeEmailModal'>
        <Form onSubmit={this.formSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={updatedEmail.password}
                onChange={this.formFieldStringState}
                required />
            </FormGroup>
            <FormGroup>
              <Label for="newEmail">New Email</Label>
              <Input
                type="email"
                name="newEmail"
                id="newEmail"
                value={updatedEmail.newEmail}
                onChange={this.formFieldStringState}
                required />
            </FormGroup>
            <p className="error">{error}</p>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">Change Email</Button>{' '}
            <Button color="secondary" value="password" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Form>
      </div>
    );
  }
}

export default ChangeEmailModal;
