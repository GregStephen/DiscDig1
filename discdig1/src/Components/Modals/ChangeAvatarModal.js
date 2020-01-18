import React from 'react';
import {
  Button, ModalBody, ModalFooter,
} from 'reactstrap';


class ChangeAvatarModal extends React.Component {

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  avatarChange = () => {
    console.error('avatar changed');
  };

  render() {
    return (
      <div>
        <ModalBody>
          <p>Change this avatar</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.avatarChange}>Commit Change</Button>{' '}
          <Button color="secondary" value="delete" onClick={this.toggleModal}>Nevermind</Button>
        </ModalFooter>
      </div>
    )
  }
};

export default ChangeAvatarModal;