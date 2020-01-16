import React from 'react';

class AvatarSelectionButton extends React.Component {
  selectThisAvatar = (e) => {
    this.props.selectAvatar(e);
  }
  render() {
    const {avatar, index} = this.props;


    return (
      <div key={avatar.id} className="avatar col-6 col-md-4 col-lg-3 mb-4">
        <button className="avatar-btn">
          <img 
            id='avatarId'
            name={avatar.id}
            className={ index === 0 ? 'avatar-image selected' : 'avatar-image'}
            src={avatar.imgUrl}
            alt={avatar.name}
            onClick={this.selectThisAvatar}>
          </img>
        </button>
      </div>
    )
  }
};

export default AvatarSelectionButton;
