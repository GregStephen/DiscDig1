import React from 'react';
import {
  Badge,
  Button,
  ModalBody,
  ModalFooter,
  Card,
  CardImg,
  CardTitle,
  CardText
} from 'reactstrap';

class AddAlbumToCollectionModal extends React.Component {
  state = {
    albumToAdd: {},
    album: {},
    artist: '',
    image: '',
    genres: [],
    styles: []
  };

  componentDidMount() {
    const {album} = this.props;
    const image = album.images[0];
    const artist = album.artists[0];
    let styles = [];
    if (album.styles != null) {
      styles = album.styles;
    }
    this.setState({album: album, artist: artist.name, image: image.resource_url, genres: album.genres, styles: styles })
  }

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  addAlbum = () => {
    console.error('added');
  };

  render() {
    const {album, artist, image, genres, styles} = this.state;
    const showGenres = genres.map(genre => (
        <Badge color="primary" pill>{genre}</Badge>
    ));
    const showStyles = styles.map(style => (
      <Badge color="primary" pill>{style}</Badge>
    ))
    return (
      <div className="AddAlbumToCollectionModal container">
        <ModalBody className="row">
          <Card className="col-12">
          <CardImg src={image} alt={album.title}/>
          <CardTitle>Are you sure you want to add this version of {album.title} to your collection?</CardTitle>
          <CardText>Released: {album.year === 0 ? 'Unknown' : album.year}</CardText>
          <CardText>By: {artist}</CardText>
          { genres.length > 0 ? 
          <div>
            <h5>Genres:</h5>
            {showGenres}
          </div>
          : '' }
          { styles.length > 0 ? 
          <div>
            <h5>Styles:</h5>
            {showStyles}
          </div>
          : '' }
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addAlbum}>Add to my main collection</Button>{' '}
          <Button color="secondary" value="delete" onClick={this.toggleModal}>Nevermind</Button>
        </ModalFooter>
      </div>
    )
  }
};

export default AddAlbumToCollectionModal;
