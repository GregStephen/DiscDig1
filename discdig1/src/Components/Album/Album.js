import React from 'react';
import {
  Modal,
  ModalHeader,
  Media,
  Button
  } from 'reactstrap';

import './Album.scss';
import AddAlbumToCollectionModal from '../Modals/AddAlbumToCollectionModal';

class Album extends React.Component {
  state = {
    addAlbumModalIsOpen: false,
    alreadyInCollection: false
  };

  componentDidMount() {
    const {mainCollectionAlbums, album } = this.props;
    if (mainCollectionAlbums.some(e => e.discogId === album.id)) {
      this.setState({ alreadyInCollection: true })
    }
  };

  toggleModalOpen = () => {
    this.setState(prevState => ({
      addAlbumModalIsOpen: !prevState.addAlbumModalIsOpen,
    }));
  };

  addAlbumToMain = (albumToAdd) => {
    const { addAlbToMain } = this.props;
    addAlbToMain(albumToAdd);
  }
  
  render() {
   const {album} = this.props;
    return (
      <div className="Album col-5">
        <Media>
          <Media left>
            <Media className="album-img" object src={album.thumb} alt={album.title}/>
          </Media>
          <Media body>
            <Media heading>
            {album.title}
            </Media>
            <p>Released: {album.year === 0 ? 'Unknown' : album.year}</p>
             { this.state.alreadyInCollection ? <Button disabled >Already Added To Collection</Button>
             : <Button onClick={this.toggleModalOpen}>Add To Collection</Button>
             }
          </Media>
        </Media>
      <Modal isOpen={this.state.addAlbumModalIsOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.addAlbumModalIsOpen}>Add To Collection</ModalHeader>
        <AddAlbumToCollectionModal
        toggleModalOpen={ this.toggleModalOpen }
        album={ album }
        userObj={ this.props.userObj }
        addAlbumToMain={ this.addAlbumToMain }
        />
      </Modal>
      </div>
    )
  }
};

export default Album;
