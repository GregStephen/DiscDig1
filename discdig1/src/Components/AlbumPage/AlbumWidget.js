import React from 'react';
import {
  Button, Card, ListGroup, ListGroupItem, Modal, ModalHeader,
} from 'reactstrap';
import ShowMoreAlbumImagesModal from '../Modals/ShowMoreAlbumImagesModal';

class AlbumWidget extends React.Component {
  state = {
    showMoreAlbumImagesModalIsOpen: false,
  }

  toggleModalOpen = () => {
    this.setState((prevState) => ({
      showMoreAlbumImagesModalIsOpen: !prevState.showMoreAlbumImagesModalIsOpen,
    }));
  };

  render() {
    const { album } = this.props;
    const { images } = album;
    let image = {
      resource_url: 'https://i.pinimg.com/originals/b3/ed/8d/b3ed8d773439c086d52b7b0d1147fda3.jpg',
    };

    if (images !== null) {
      image = images.find((img) => img.type === 'primary');
    }

    let genres = [];
    let styles = [];
    if (album.styles != null) {
      styles = album.styles;
    }
    if (album.genres != null) {
      genres = album.genres;
    }
    const displayArtists = album.artists.map((artist, i) => {
      if (i === 0) {
        return `${artist.name}`;
      }

      return `, ${artist.name}`;
    });
    const showGenres = genres.map((genre, i) => {
      if (i === 0) {
        return `${genre}`;
      }

      return `, ${genre}`;
    });

    const showStyles = styles.map((style, i) => {
      if (i === 0) {
        return `${style}`;
      }

      return `, ${style}`;
    });

    const showLabel = album.labels.map((label, i) => {
      if (i === 0) {
        return `${label.name}`;
      }

      return `, ${label.name}`;
    });

    return (
      <div className="AlbumWidget row">
        <Card>
          <div className="image-holder col-12">
            <img className="album-image" src={image.resource_url} alt={album.title}></img>
            <Button onClick={this.toggleModalOpen}>Show More Images</Button>
          </div>
          <div className="col-12">
            <ListGroup>
              <ListGroupItem>Artist(s): {displayArtists}</ListGroupItem>
              {genres.length > 0
                ? <ListGroupItem>Genre: {showGenres}</ListGroupItem>
                : ''}
              {styles.length > 0
                ? <ListGroupItem>Style: {showStyles}</ListGroupItem>
                : ''}
              <ListGroupItem>Label: {showLabel}</ListGroupItem>
              <ListGroupItem>Country: {album.country}</ListGroupItem>
              <ListGroupItem>Released: {album.released === null ? 'Unknown' : album.released}</ListGroupItem>
            </ListGroup>
          </div>
        </Card>
        <Modal size='md' isOpen={this.state.showMoreAlbumImagesModalIsOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.showMoreAlbumImagesModalIsOpen}>
            All Images
          </ModalHeader>
          <ShowMoreAlbumImagesModal
            images={album.images}
            toggleModalOpen={this.toggleModalOpen}
          />
        </Modal>
      </div>
    );
  }
}

export default AlbumWidget;
