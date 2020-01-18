import React from 'react';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  Button
  } from 'reactstrap';

import './Album.scss';
import AddAlbumToCollectionModal from '../Modals/AddAlbumToCollectionModal';

class Album extends React.Component {
  state = {
    addAlbumModalIsOpen: false,
  };

  addToCollection = () => {
    console.error('added to collection');
  };

  toggleModalOpen = () => {
    this.setState(prevState => ({
      addAlbumModalIsOpen: !prevState.addAlbumModalIsOpen,
    }));
  };

  render() {
   const {album} = this.props;
    return (
      <div className="Album col-2">
        <Card>
        <CardImg top src={album.thumb} alt={album.title} />
        <CardBody>
          <CardTitle>{album.title}</CardTitle>
          <Button onClick={this.toggleModalOpen}>Add To Collection</Button>
        </CardBody>
      </Card>
      <Modal isOpen={this.state.addAlbumModalIsOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.addAlbumModalIsOpen}>Add To Collection</ModalHeader>
        <AddAlbumToCollectionModal
        toggleModalOpen={ this.toggleModalOpen }
        album={ album }
        />
      </Modal>
      </div>
    )
  }
};

export default Album;
