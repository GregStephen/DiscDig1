import React from 'react';

import UserWidget from '../UserWidget/UserWidget';

import './UserProfile.scss';

class UserProfile extends React.Component {
  render() {
    const {userObj} = this.props;
    return (
      <div className="UserProfile container">
        <div className="row">
          <UserWidget 
          userObj={ userObj }
          avatar={ userObj.avatar }
          />
        </div>
      </div>
    )
  }
}

export default UserProfile;
