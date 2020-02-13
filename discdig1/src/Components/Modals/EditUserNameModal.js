import React from 'react';
import {
  Form, Label, Input, Button, ModalBody,FormGroup, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';

const defaultUser = {
  id: '',
  firstName: '',
  lastName: '',
}

class EditUserInfoModal extends React.Component {
  state = {
    updatedUser: defaultUser,
  }

  static propTypes = {
    userObj: PropTypes.object.isRequired,
    toggleModalOpen: PropTypes.func,
    userEdited: PropTypes.func,
  }

  
  componentDidMount() {
    const {userObj} = this.props;
    this.setState({ updatedUser: userObj})
  };

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  formSubmit = (e) => {    
    e.preventDefault();
    const { updatedUser } = this.state;
    const { userEdited } = this.props;
    userEdited(updatedUser);
    this.toggleModal();
  };

  formFieldStringState = (e) => {
    const tempUser = { ...this.state.updatedUser };
    tempUser[e.target.id] = e.target.value;
    this.setState({ updatedUser: tempUser });
  };

  render() {
    const { updatedUser } = this.state;
    return (
      <div className="EditUserInfoModal">
      <Form onSubmit={this.formSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="firstName">First Name:</Label>
            <Input
              type="input"
              name="firstName"
              id="firstName"
              value={updatedUser.firstName}
              onChange={this.formFieldStringState}
              required />
            <Label for="lastName">Last Name:</Label>
            <Input
              type="input"
              name="lastName"
              id="lastName"
              value={updatedUser.lastName}
              onChange={this.formFieldStringState}
              required />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">Edit Account</Button>{' '}
          <Button color="secondary" value="info" onClick={this.toggleModal}>Cancel</Button>
        </ModalFooter>
      </Form>
    </div>
    )
  }
}

export default EditUserInfoModal;
