import React from 'react';
import {
  Button, ModalBody, ModalFooter,
} from 'reactstrap';

class AddAlbumToCollectionModal extends React.Component {
  state = {
    albumToAdd: {}
  };


  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  addAlbum = () => {
    console.error('added');
  };

  render() {
    const {albumToAdd} = this.state;
    return (
      <div>
        <ModalBody>
          <p>Add {albumToAdd.title}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addAlbum}>Commit Change</Button>{' '}
          <Button color="secondary" value="delete" onClick={this.toggleModal}>Nevermind</Button>
        </ModalFooter>
      </div>
    )
  }
};

export default AddAlbumToCollectionModal;
