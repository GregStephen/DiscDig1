import React from 'react';
import {
  Card,
  CardImg,
  CardBody,
  CardSubtitle,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader}
  from 'reactstrap';
import moment from 'moment';

import ChangeAvatarModal from '../Modals/ChangeAvatarModal';
import ChangeEmailModal from '../Modals/ChangeEmailModal';
import ChangePasswordModal from '../Modals/ChangePasswordModal';
import DeleteUserModal from '../Modals/DeleteUserModal';
import EditUserNameModal from '../Modals/EditUserNameModal';

import './UserWidget.scss';

class UserWidget extends React.Component {
  state = {
    modalOpen: '',
    userPageModalIsOpen: false,
  }

  toggleModalOpen = (value) => {
    this.setState({ modalOpen: value })
    this.setState(prevState => ({
      userPageModalIsOpen: !prevState.userPageModalIsOpen,
    }));
  };

  userEdited = (editedUser) => {
    this.props.editTheUser(editedUser);
  };

  userDeleted = () => {
    this.props.deleteTheUser();
  };

  render() {
    const { modalOpen } = this.state;
    const { userObj, avatar } = this.props;
    const displayDate = moment(userObj.dateCreated).format('LL');
    return (
      <div className="UserWidget col-4">
        <Card>
          <CardBody>
            <CardTitle>{userObj.firstName} {userObj.lastName}</CardTitle>
            <CardSubtitle>Proud Digger since: {displayDate}</CardSubtitle>
            <CardImg className="profile-avatar" src={avatar.imgUrl} alt={avatar.name} />
            <ListGroup flush>
              <ListGroupItem className="profile-modal" tag="a"  onClick={() => this.toggleModalOpen('name')}>Change Name</ListGroupItem>
              <ListGroupItem className="profile-modal" tag="a" onClick={() => this.toggleModalOpen('avatar')}>Change Avatar</ListGroupItem>
              <ListGroupItem className="profile-modal" tag="a" onClick={() => this.toggleModalOpen('email')}>Change Email</ListGroupItem>
              <ListGroupItem className="profile-modal" tag="a" onClick={() => this.toggleModalOpen('password')}>Change Password</ListGroupItem>
              <ListGroupItem className="profile-modal" tag="a" onClick={() => this.toggleModalOpen('delete')}>Delete Account</ListGroupItem>
            </ListGroup>
          </CardBody>
        </Card>
        <Modal isOpen={this.state.userPageModalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.userPageModalIsOpen}>
            {modalOpen === 'name' ? 'Edit Name' : 
            modalOpen === 'avatar' ? 'Change Avatar' :
            modalOpen === 'password' ? 'Change Password' : 
            modalOpen === 'email' ? 'Change Email' : 
            modalOpen === 'delete' ? 'Delete Account' : ''}
          </ModalHeader>
          { modalOpen === 'name' ? 
            <EditUserNameModal
            toggleModalOpen = { this.toggleModalOpen } 
            userObj = { userObj }  
            userEdited = { this.userEdited }                 
            /> 
            : modalOpen === 'avatar' ?
            <ChangeAvatarModal
            toggleModalOpen = { this.toggleModalOpen }
            userObj = { userObj }
            />
            : modalOpen === 'password' ?
            <ChangePasswordModal
            toggleModalOpen = { this.toggleModalOpen } 
            userObj = { userObj }               
            />
            : modalOpen === 'email' ?
            <ChangeEmailModal
            toggleModalOpen = { this.toggleModalOpen }
            userObj = { userObj }
            />
            : modalOpen === 'delete' ? 
            <DeleteUserModal
            toggleModalOpen = { this.toggleModalOpen } 
            userObj = { userObj }
            userDeleted = { this.userDeleted } 
            />
            : ''
          }
          </Modal>
      </div>
    )
  }
};

export default UserWidget;
