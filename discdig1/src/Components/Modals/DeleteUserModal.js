import React from 'react';
import {
  Button, ModalBody, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';


class DeleteUserModal extends React.Component {
  static propTypes = {
    userObj: PropTypes.object.isRequired,
    toggleModalOpen: PropTypes.func,
    userDeleted: PropTypes.func,
  };

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  confirmDeletion = () => {
    const { userDeleted } = this.props;
    this.toggleModal();
    userDeleted();
  };

  render() {
    return (
      <div className='DeleteUserModal'>
        <ModalBody>
          <p>Are you sure you want to delete your account?!</p>
          <p>This can NOT be undone...</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.confirmDeletion}>Yes, Delete My Account</Button>{' '}
          <Button color="secondary" value="delete" onClick={this.toggleModal}>No, I don't want to delete myself</Button>
        </ModalFooter>
      </div>
    );
  }
}

export default DeleteUserModal;
