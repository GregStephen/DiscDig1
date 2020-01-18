import React from 'react';
import {
  Button, ModalBody, ModalFooter,
} from 'reactstrap';

import discogRequests from '../../Helpers/Data/discogRequests';


class AddAlbumToCollectionModal extends React.Component {
  state = {
    albumToAdd: {}
  };

  componentDidMount() {
    const { album } = this.props;
    discogRequests.getAlbumById(album.id)
      .then((result) => {
        this.setState({ albumToAdd: result})
      })
      .catch()
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
          <p>Add this album</p>
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
