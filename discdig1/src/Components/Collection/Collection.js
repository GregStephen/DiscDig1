import React from 'react';
import { Button } from 'reactstrap';

import CollectionAlbum from '../CollectionAlbum/CollectionAlbum';

import './Collection.scss';

const defaultCheckedAlbums = {
  0: false
};

class Collection extends React.Component{
  state = {
    checkedAlbums: defaultCheckedAlbums
  };

  handleAlbumChecks = (e) => {
    const tempAlbumsChecked = { ...this.state.checkedAlbums };
    tempAlbumsChecked[e.target.id] = e.target.checked;
    this.setState({ checkedAlbums: tempAlbumsChecked });
  };

  deleteSelectedAlbums = () => {
    const { collection, deleteAlbums } = this.props;
    const { checkedAlbums } = this.state;
    const albumsToDelete = Object.keys(checkedAlbums).filter(function(id) {
        return checkedAlbums[id]
    })
    const objectForDeletion = {};
    objectForDeletion.collectionId = collection.id;
    objectForDeletion.deleteTheseAlbums = albumsToDelete;
    deleteAlbums(objectForDeletion);
  }
  render() {
    const { collection } = this.props;
    const albums = collection.albums;
    const showCollection = albums.map((album) => (
      <CollectionAlbum
      album={ album }
      key={ album.id }
      onCheck={ this.handleAlbumChecks }
      isChecked={ this.state.checkedAlbums[album.id] }
      />
    ))

    return (
      <div className="Collection container">
        <Button className="btn-danger" onClick={ this.deleteSelectedAlbums }>Delete Selected Albums</Button>
        <p>{ collection.name }</p>
        <div className="row justify-content-around">
        { showCollection }
        </div>
      </div>
    )
  }
};

export default Collection;
