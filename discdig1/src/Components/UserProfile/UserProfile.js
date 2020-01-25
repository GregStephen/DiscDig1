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
  render() {
    const {userObj} = this.props;
    return (
      <div className="UserProfile container">
        <div className="row">
          <div className="row col-sm-12 col-lg-6">
            <UserWidget 
            userObj={ userObj }
            avatar={ userObj.avatar }
            deleteTheUser={ this.deleteTheUser }
            editTheUser={ this.editTheUser }
            />
          </div>
          <div className="row col-sm-12 col-lg-6">
            <UserDashboard
            userObj={ userObj }
            collections={ this.props.collections }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default UserProfile;
