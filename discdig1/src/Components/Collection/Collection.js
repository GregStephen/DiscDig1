import React from 'react';
import { Button } from 'reactstrap';

import CollectionAlbum from '../CollectionAlbum/CollectionAlbum';

import AddToSubcollection from '../AddToSubcollection/AddToSubcollection';

import './Collection.scss';

const defaultCheckedAlbums = {
  0: false
};

class Collection extends React.Component{
  state = {
    checkedAlbums: defaultCheckedAlbums,
    chosenSubcollectionId: ''
  };

  componentDidUpdate({ collection }) {
    if (this.props.collection !== collection) {
      this.setState({ checkedAlbums: defaultCheckedAlbums });
    }
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
    this.setState({ checkedAlbums: defaultCheckedAlbums });
    
  };

  addToSubcollection = (subcollectionChoice) => {
    const { checkedAlbums } = this.state;
    const { addAlbumToSubCollection } = this.props;
    const albumsToAdd = Object.keys(checkedAlbums).filter(function(id) {
      return checkedAlbums[id]
  })
    const objForAddingAlbum = {};
    objForAddingAlbum.albumsToAdd = albumsToAdd;
    objForAddingAlbum.collectionId = subcollectionChoice;
    addAlbumToSubCollection(objForAddingAlbum);
    this.setState({ checkedAlbums: defaultCheckedAlbums });
  }

changeSubCollection = (e) => {
  const tempChosenCollectionId = e.target.value;
  this.setState({ chosenSubcollectionId: tempChosenCollectionId })
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
      collection={ collection }
      chosenSubcollectionId={ this.state.chosenSubcollectionId }
      collections={ this.props.collections }
      />
    ))

    return (
      <div className="Collection container">
        <Button className="btn-danger" onClick={ this.deleteSelectedAlbums }>Delete Selected Albums</Button>
        <AddToSubcollection 
        collection={ collection }
        addToSubcollection={ this.addToSubcollection }
        userObj= {this.props.userObj}
        changeSubCollection={ this.changeSubCollection }
        />
        <p>{ collection.name }</p>
        <div className="row justify-content-around">
        { showCollection }
        </div>
      </div>
    )
  }
};

export default Collection;
