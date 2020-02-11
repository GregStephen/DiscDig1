import React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import CollectionAlbum from '../CollectionAlbum/CollectionAlbum';

import AddToSubcollection from '../AddToSubcollection/AddToSubcollection';

import './Collection.scss';

const defaultCheckedAlbums = {
  0: false
};

class Collection extends React.Component {
  state = {
    checkedAlbums: defaultCheckedAlbums,
    chosenSubcollectionId: '',
  };

  // if the collection is updated, all the checkboxes in the albums become unchecked
  componentDidUpdate({ collection }) {
    if (this.props.collection !== collection) {
      this.setState({ checkedAlbums: defaultCheckedAlbums });
    }
  };

  // sets the state for whichever album is checked or then unchecked
  handleAlbumChecks = (e) => {
    const tempAlbumsChecked = { ...this.state.checkedAlbums };
    tempAlbumsChecked[e.target.id] = e.target.checked;
    this.setState({ checkedAlbums: tempAlbumsChecked });
  };

  // creates an object containing all the checked albums and the collection id
  // passes that object up to Home.js
  deleteSelectedAlbums = () => {
    const { collection, deleteAlbums } = this.props;
    const { checkedAlbums } = this.state;
    const albumsToDelete = Object.keys(checkedAlbums).filter(function (id) {
      return checkedAlbums[id]
    })
    const objectForDeletion = {};
    objectForDeletion.collectionId = collection.id;
    objectForDeletion.deleteTheseAlbums = albumsToDelete;
    deleteAlbums(objectForDeletion);
  };

  addToSubcollection = (subcollectionChoice) => {
    const { checkedAlbums } = this.state;
    const { addAlbumToSubCollection, collections } = this.props;
    // creates an array of the ids of the albums checked
    const albumsToAdd = Object.keys(checkedAlbums).filter(function (id) {
      return checkedAlbums[id]
    })

    // gets the array of albums that already exist in the chosen subcollection
    const subCollectionBeingAddedTo = collections.filter(coll => coll.id === subcollectionChoice);
    const subCollectionBeingAddedToAlbumsList = subCollectionBeingAddedTo[0].albums;

    // checks to see if each album is already in the subcollection
    const albumsToAddNotDuplicated = [];
    albumsToAdd.forEach((album) => {
      const check = subCollectionBeingAddedToAlbumsList.filter(existingAlbum => existingAlbum.id === album);
      if (check.length === 0) {
        albumsToAddNotDuplicated.push(album);
      }
    })

    // creates the object of albums and subcollection id to push
    if (albumsToAddNotDuplicated.length > 0) {
      const objForAddingAlbum = {};
      objForAddingAlbum.albumsToAdd = albumsToAddNotDuplicated;
      objForAddingAlbum.collectionId = subcollectionChoice;
      addAlbumToSubCollection(objForAddingAlbum);
    }
  }

  // sets the state of whichever subcollection is chosen
  changeSubCollection = (e) => {
    const tempChosenCollectionId = e.target.value;
    this.setState({ chosenSubcollectionId: tempChosenCollectionId })
  }

  render() {
    const { collection, searchedTerm } = this.props;
    const albums = collection.albums;
    const showCollection = albums.map((album) => (
      <CollectionAlbum
        album={album}
        key={album.id}
        onCheck={this.handleAlbumChecks}
        isChecked={this.state.checkedAlbums[album.id]}
        collection={collection}
        chosenSubcollectionId={this.state.chosenSubcollectionId}
        collections={this.props.collections}
      />
    ))

    return (
      <div className="Collection container">
        <div className="row">
          <div className="subcollection col-sm-12 col-lg-3">
            <AddToSubcollection
              collection={collection}
              addToSubcollection={this.addToSubcollection}
              userObj={this.props.userObj}
              changeSubCollection={this.changeSubCollection}
            />
            <Link className="btn btn-info subcollection-btn" to='/subcollections'> Manage Subcollections</Link>
            {collection.id !== undefined ?
              <Button className="btn-danger subcollection-btn" onClick={this.deleteSelectedAlbums}>Delete Selected Albums</Button>
              : ''}
          </div>
          <div className="col-sm-12 col-lg-9">
            <p className="collection-name">{collection.name}</p>
            {searchedTerm !== '' ? <p>{collection.numberInCollection} results for {searchedTerm}</p>
              : ""}
            <div className="row justify-content-around">
              {collection.albums.length > 0 ? showCollection : 
              <p className="no-albums">You have no albums to show! Try adding some first</p>}
            </div>
          </div>
        </div>

      </div>
    )
  }
};

export default Collection;
