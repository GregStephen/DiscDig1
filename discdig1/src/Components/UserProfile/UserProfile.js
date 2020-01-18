import React from 'react';

import UserWidget from '../UserWidget/UserWidget';

import './UserProfile.scss';

class UserProfile extends React.Component {

  deleteTheUser = () => {
    this.props.deleteThisUser();
  }

  editTheUser = (editedUser) => {
    this.props.editThisUser(editedUser);
  }
  render() {
    const {userObj} = this.props;
    return (
      <div className="UserProfile container">
        <div className="row">
          <UserWidget 
          userObj={ userObj }
          avatar={ userObj.avatar }
          deleteTheUser={ this.deleteTheUser }
          editTheUser={ this.editTheUser }
          />
        </div>
      </div>
    )
  }
}

export default UserProfile;
