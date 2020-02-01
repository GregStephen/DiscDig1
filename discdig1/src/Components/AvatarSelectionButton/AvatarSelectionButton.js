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
          >
          <img 
            src={avatar.imgUrl}
            alt={avatar.name}
            id='avatarId'
            name={avatar.id}
            className={ index === 0 ? 'avatar-image selected' : 'avatar-image'}
            onClick={this.selectThisAvatar}>
          </img>
        </Button>
      </div>
    )
  }
};

export default AvatarSelectionButton;
