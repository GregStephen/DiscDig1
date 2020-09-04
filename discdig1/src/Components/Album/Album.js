/* eslint-disable max-len */
import React from 'react';
import {
  Modal,
  ModalHeader,
  Media,
  Button,
} from 'reactstrap';

import './Album.scss';
import AddAlbumToCollectionModal from '../Modals/AddAlbumToCollectionModal';

class Album extends React.Component {
  state = {
    addAlbumModalIsOpen: false,
    alreadyInCollection: false,
  };

  componentDidMount() {
    this.checkToSeeIfAlreadyInCollection();
  }

  componentDidUpdate({ mainCollectionAlbums }) {
    if (this.props.mainCollectionAlbums !== mainCollectionAlbums) {
      this.checkToSeeIfAlreadyInCollection();
    }
  }

  checkToSeeIfAlreadyInCollection = () => {
    const { mainCollectionAlbums, album } = this.props;
    if (mainCollectionAlbums.some((e) => e.discogId === album.id)) {
      this.setState({ alreadyInCollection: true });
    }
  };

  toggleModalOpen = () => {
    this.setState((prevState) => ({
      addAlbumModalIsOpen: !prevState.addAlbumModalIsOpen,
    }));
  };

  addAlbumToMain = (albumToAdd) => {
    const { addAlbToMain } = this.props;
    addAlbToMain(albumToAdd);
  };

  render() {
    const { album } = this.props;
    let thumb = 'https://i.pinimg.com/originals/b3/ed/8d/b3ed8d773439c086d52b7b0d1147fda3.jpg';
    if (album.thumb !== '') {
      thumb = album.thumb;
    }
    return (
      <div className="Album col-5">
        <Media>
          <Media left>
            <Media className="album-img" object src={thumb} alt={album.title} />
          </Media>
          <Media body>
            <Media heading>
              {album.title}
            </Media>
            <p>Released: {album.year === 0 ? 'Unknown' : album.year}</p>
            <p>Cat#: {album.catno}</p>
            {this.state.alreadyInCollection ? <Button disabled >Already Added To Collection</Button>
              : <Button onClick={this.toggleModalOpen}>Add To Collection</Button>
            }
          </Media>
        </Media>
        <Modal isOpen={this.state.addAlbumModalIsOpen} toggle={this.toggleModalOpen}>
          <ModalHeader toggle={this.addAlbumModalIsOpen}>Add To Collection</ModalHeader>
          <AddAlbumToCollectionModal
            toggleModalOpen={this.toggleModalOpen}
            album={album}
            userObj={this.props.userObj}
            addAlbumToMain={this.addAlbumToMain}
          />
        </Modal>
      </div>
    );
  }
}

export default Album;
