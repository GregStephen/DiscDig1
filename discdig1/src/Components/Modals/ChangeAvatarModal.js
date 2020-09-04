import React from 'react';
import {
  Button, ModalBody, ModalFooter,
} from 'reactstrap';
import $ from 'jquery';

import AvatarSelectionButton from '../AvatarSelectionButton/AvatarSelectionButton';

import avatarRequests from '../../Helpers/Data/avatarRequests';

import './ChangeAvatarModal.scss';

class ChangeAvatarModal extends React.Component {
  state = {
    avatars: [],
    newAvatarId: '',
  }

  componentDidMount() {
    // sets state of all avatars from db
    avatarRequests.getAllAvatars()
      .then((avatars) => this.setState({ avatars }))
      .catch((err) => console.error('trouble getting avatars', err));
  }

  // puts border on selected avatar and sets it to state
  selectAvatar = (e) => {
    e.preventDefault();
    const avatarSelection = $('.avatar-btn');
    for (let i = 0; i < avatarSelection.length; i += 1) {
      avatarSelection[i].classList.remove('selected');
    }
    e.currentTarget.classList.add('selected');
    const tempAvatar = e.currentTarget.name;
    this.setState({ newAvatarId: tempAvatar });
  }

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  avatarChange = () => {
    const { newAvatarId } = this.state;
    const { avatarChanged, userObj } = this.props;
    const avatarObj = {
      userId: userObj.id,
      avatarId: newAvatarId,
    };
    avatarChanged(avatarObj);
    this.toggleModal();
  };

  render() {
    const { avatars } = this.state;
    const showAvatars = avatars.map((avatar, index) => (
      <AvatarSelectionButton
        key={index}
        avatar={avatar}
        index={index}
        selectAvatar={this.selectAvatar}
      />
    ));
    return (
      <div className="ChangeAvatarModal">
        <ModalBody>
          <div className="form-group col-12 row justify-content-center">
            <p className="avatar-select-header col-12">Select Your Avatar</p>
            <div className="row col-12 justify-content-around">
              {showAvatars}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.avatarChange}>Commit Change</Button>{' '}
          <Button color="secondary" value="delete" onClick={this.toggleModal}>Nevermind</Button>
        </ModalFooter>
      </div>
    );
  }
}

export default ChangeAvatarModal;
