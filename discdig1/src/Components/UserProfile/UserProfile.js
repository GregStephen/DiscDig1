import React from 'react';

import './UserProfile.scss';

class UserProfile extends React.Component {
  render() {
    const {userObj} = this.props;
    const avatar = userObj.avatar;
    return (
      <div className="UserProfile">
        <h3>{userObj.firstName}</h3>
        <img src={avatar.imgUrl} alt={avatar.name}></img>
      </div>
    )
  }
}

export default UserProfile;
