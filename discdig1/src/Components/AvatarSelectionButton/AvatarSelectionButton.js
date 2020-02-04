import React from 'react';
import { Button } from 'reactstrap';

class AvatarSelectionButton extends React.Component {
  selectThisAvatar = (e) => {
    this.props.selectAvatar(e);
  }
  render() {
    const {avatar, index} = this.props;
    return (
      <div key={avatar.id} className="avatar col-6 col-md-4 col-lg-3 mb-4">
        <Button 
          color='link'
          type="button" 
          id='avatarId'
          name={avatar.id}
          onClick={this.selectThisAvatar}
          className={ index === 0 ? 'avatar-btn selected' : 'avatar-btn'}
          >
          <img 
            src={avatar.imgUrl}
            alt={avatar.name}
            className="avatar-image"
            >
          </img>
        </Button>
      </div>
    )
  }
};

export default AvatarSelectionButton;
