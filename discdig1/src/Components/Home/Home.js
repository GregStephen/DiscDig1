import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

import Collection from '../Collection/Collection';
import CollectionSearchBar from '../CollectionSearchBar/CollectionSearchBar';
import AddAlbumPagination from '../AddAlbumPagination/AddAlbumPagination';
import collectionRequests from '../../Helpers/Data/collectionRequests';

import './Home.scss';


const defaultCollection = {
  albums: [],
  name: '',
};

const defaultCheckedGenres = {
  0: false
}

class Home extends React.Component {
  state = {
    collection: defaultCollection,
    collectionChoice: '',
    searchedTerm: '',
    totalPages: 0,
    currentPage: 0,
    checkedGenres: defaultCheckedGenres,
  };

  // when the collections get updated by deleting an album, it rerenders it with the updated collection
  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.showChosenCollection(this.state.collectionChoice);
    }
  };

  // Takes in an id of chosen collection and sets the state of the collection to that particular one
  showChosenCollection = (idOfChosenCollection) => {
    if (idOfChosenCollection === '') {
      this.setState({ collection: defaultCollection })
    }
    else {
      collectionRequests.getCollectionById(idOfChosenCollection)
        .then(result => this.setState({ collection: result }))
        .catch(err => console.error(err));
    }
  };

  // Takes in an object and then passes it up to App.js to delete it and then rerenders with componentDidUpdate
  deleteAlbums = (objectForDeletion) => {
    const { deleteAllTheseAlbums } = this.props;
    deleteAllTheseAlbums(objectForDeletion);
  }

  // sets the state of the collectionChoice for use later, passes in the actual id to the function
  changeCollectionState = (e) => {
    const tempChosenCollectionId = e.target.value;
    this.setState({ collectionChoice: tempChosenCollectionId });
    this.showChosenCollection(tempChosenCollectionId);
  };

  // Passes in an object to App.js to add albums to a selected subcollection
  addAlbumToSubCollection = (objToAdd) => {
    const { addSelectedAlbumsToSubCollection } = this.props;
    addSelectedAlbumsToSubCollection(objToAdd);
  }

  // sets state of the collection by what results come up from the search bar
  displaySearchedCollection = (term, genres, page) => new Promise((resolve, reject) => {
    const { collection } = this.state;
    this.setState({ searchedTerm: term, checkedGenres: genres });
    collectionRequests.searchCollection(term, collection.id, genres, page)
      .then((result) => {
        this.setState({ 
          collection: result, 
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages })
        resolve(result)
      }).catch(err => reject(err));
  });

  changePage = (page) => {
    const { searchedTerm, checkedGenres } = this.state;
    this.displaySearchedCollection(searchedTerm, checkedGenres, page);
  }

  render() {
    const { userObj, collections } = this.props;
    const { collection, collectionChoice, searchedTerm, totalPages, currentPage } = this.state;

    const returnOptions = () => {
      if (collections.length !== 0) {
        const main = collections.find(collection => collection.name === 'Main');
        const subs = collections.filter(collection => collection.name !== 'Main');
        const options = subs.map(subCollection => (
          <option key={subCollection.id} value={subCollection.id}>{subCollection.name} ({subCollection.numberInCollection})</option>
        ))
        options.unshift(<option key={main.id} value={main.id}>{main.name} ({main.numberInCollection})</option>);
        return options;
      }
    }

    return (
      <div className="Home container">
        <h2>Hey {userObj.firstName}</h2>
        <div className="row justify-content-center">
          <FormGroup className="col-lg-7 col-12 ">
            <Label for="collectionChoice"></Label>
            <Input
              type="select"
              name="collectionChoice"
              id="collectionChoice"
              value={collectionChoice}
              onChange={this.changeCollectionState}
            >
              <option value=''>Choose a collection to display</option>
              {returnOptions()}

            </Input>
          </FormGroup>

          <CollectionSearchBar
            displaySearchedCollection={this.displaySearchedCollection}
            collectionChoice={collectionChoice}
            collection={collection}
          />

          <AddAlbumPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={this.changePage}
          />
        </div>
        <Collection
          className="row"
          userObj={userObj}
          collection={collection}
          searchedTerm={searchedTerm}
          deleteAlbums={this.deleteAlbums}
          addAlbumToSubCollection={this.addAlbumToSubCollection}
          collections={this.props.collections}
        />
      </div>
    )
  }
};

export default Home;
