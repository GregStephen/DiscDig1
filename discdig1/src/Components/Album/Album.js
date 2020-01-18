import React from 'react';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Modal,
  ModalHeader,
  Button
  } from 'reactstrap';

import './Album.scss';
import AddAlbumToCollectionModal from '../Modals/AddAlbumToCollectionModal';
import discogRequests from '../../Helpers/Data/discogRequests';

class Album extends React.Component {
  state = {
    album: {},
    artist: '',
    image: '',
    addAlbumModalIsOpen: false,
  };

  componentDidMount() {
    const {album} = this.props;
     discogRequests.getAlbumById(album.id)
      .then((result) => {
        const image = result.images[0];
        const artist = result.artists[0];
        this.setState({album: result, artist: artist.name, image:image.resource_url })})
      .catch(err => console.error(err));
  }

  addToCollection = () => {
    console.error('added to collection');
  };

  toggleModalOpen = () => {
    this.setState(prevState => ({
      addAlbumModalIsOpen: !prevState.addAlbumModalIsOpen,
    }));
  };

  render() {
   const {album, image, artist} = this.state;
    return (
      <div className="Album col-4">
        <Card>
        <CardImg top src={image} alt={album.title} />
        <CardBody>
          <CardTitle>{album.title}</CardTitle>
          <CardTitle>{artist}</CardTitle>
          <CardText>Released: {album.year === 0 ? 'Unknown' : album.year}</CardText>
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
