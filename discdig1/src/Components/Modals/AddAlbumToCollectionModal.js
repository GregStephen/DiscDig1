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

import discogRequests from '../../Helpers/Data/discogRequests'; 
import collectionRequests from '../../Helpers/Data/collectionRequests';

const defaultAlbum = {
  title: '',
  imgUrl: '',
  label: '',
  artist: '',
  releaseYear: '',
  discogId: '',
  genre: [],
  style: []
}

class AddAlbumToCollectionModal extends React.Component {
  state = {
    newAlbum: defaultAlbum,
  };

  componentDidMount() {
    const {album} = this.props;
    discogRequests.getAlbumById(album.id)
     .then((result) => {
       const image = result.images[0];
       const artist = result.artists[0];
       const label = result.labels[0];
       let styles = [];
       if (result.styles != null) {
         styles = result.styles;
       }
       const tempAlbum = {...this.state.newAlbum}
       tempAlbum.title = result.title;
       tempAlbum.imgUrl = image.resource_url;
       tempAlbum.artist = artist.name;
       tempAlbum.genre = result.genres;
       tempAlbum.style = styles;
       tempAlbum.discogId = result.id;
       tempAlbum.releaseYear = result.year;
       tempAlbum.label = label.name;
       this.setState({ newAlbum : tempAlbum });
      });
  }

  toggleModal = (e) => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen(e);
  };

  addAlbum = () => {
    const {newAlbum} = this.state;
    const userId = this.props.userObj.id;
    const albumToAdd = {};
    albumToAdd.newAlbum = newAlbum;
    albumToAdd.userId = userId;
    console.error(albumToAdd);
    collectionRequests.addAlbumToMainCollection(albumToAdd)
      .then(() => this.toggleModal())
      .catch(err => console.error(err))
  };

  render() {
    const { newAlbum } = this.state;
    const genres = newAlbum.genre;
    const styles = newAlbum.style;
    const showGenres = genres.map(genre => (
      <Badge key={genre}color="primary" pill>{genre}</Badge>
    ));
    const showStyles = styles.map(style => (
      <Badge key={style} color="primary" pill>{style}</Badge>
    ))
    return (
      <div className="AddAlbumToCollectionModal container">
        <ModalBody className="row">
          <Card className="col-12">
          <CardImg src={newAlbum.imgUrl} alt={newAlbum.title}/>
          <CardTitle>Are you sure you want to add this version of {newAlbum.title} to your collection?</CardTitle>
          <CardText>Released: {newAlbum.releaseYear === 0 ? 'Unknown' : newAlbum.releaseYear}</CardText>
          <CardText>By: {newAlbum.artist}</CardText>
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
