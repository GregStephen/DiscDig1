import React from 'react';

import UserDashboard from '../UserDashboard/UserDashboard';
import UserWidget from '../UserWidget/UserWidget';

import './UserProfile.scss';


class UserProfile extends React.Component {
  deleteTheUser = () => {
    this.props.deleteThisUser();
  }

  editTheUser = (editedUser) => {
    this.props.editThisUser(editedUser);
  }

  changeAvatar = (changedAvatar) => {
    this.props.changeThisAvatar(changedAvatar);
  }

  render() {
    const { userObj } = this.props;
    return (
      <div className="UserProfile container">
        <div className="row">
          <div className="col-sm-12 col-md-7 col-lg-6">
            <UserWidget
              userObj={userObj}
              avatar={userObj.avatar}
              deleteTheUser={this.deleteTheUser}
              editTheUser={this.editTheUser}
              changeAvatar={this.changeAvatar}
            />
          </div>
          <div className="col-sm-12 col-md-5 col-lg-6">
            <UserDashboard
              userObj={userObj}
              collections={this.props.collections}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
