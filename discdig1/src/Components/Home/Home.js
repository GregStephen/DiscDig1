import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

import Collection from '../Collection/Collection';
import CollectionSearchBar from '../CollectionSearchBar/CollectionSearchBar';
import CollectionSortBtn from '../CollectionSortBtn/CollectionSortBtn';
import AddAlbumPagination from '../AddAlbumPagination/AddAlbumPagination';

import collectionRequests from '../../Helpers/Data/collectionRequests';
import genreRequests from '../../Helpers/Data/genreRequests';

import './Home.scss';
import CollectionSortDirectionSelect from '../CollectionSortDirectionBtn/CollectionSortDirectionSelect';


const defaultCollection = {
  albums: [],
  name: '',
};

const defaultGenres = [
  {
    id: '0',
    name: '',
    totalAlbums: 0
  }
];

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
    genres: defaultGenres,
    checkedGenres: defaultCheckedGenres,
    sortByChoice: '',
    sortDirectionChoice: 'ASC',
    bottomNumber: 0,
    topNumber: 0,
  };

  componentDidMount() {
    this.setCheckboxes();
    if (this.props.collections.length > 0) {
      this.showChosenCollection(this.state.collectionChoice);
    }
  }
  // when the collections get updated by deleting an album, it rerenders it with the updated collection
  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.showChosenCollection(this.state.collectionChoice);
    }
  };

  getCountOfResultsShown = () => {
    const { currentPage, collection } = this.state;
    const perPage = 10;
    let topNumber = (currentPage * perPage);
    const bottomNumber = (topNumber - (perPage - 1));
    if (topNumber > collection.numberInCollection) {
      topNumber = collection.numberInCollection;
    }
    this.setState({ bottomNumber, topNumber })
  };
  // Takes in an id of chosen collection and sets the state of the collection to that particular one and resets searchedTerm state
  showChosenCollection = (idOfChosenCollection) => {
    const { collections } = this.props;
    const { sortByChoice, sortDirectionChoice } = this.state;
    const main = collections.find(collection => collection.name === 'Main');
    if (idOfChosenCollection === '') {
      this.setState({ collectionChoice: main.id })
      idOfChosenCollection = main.id
    }

    collectionRequests.searchCollection('', idOfChosenCollection, this.state.checkedGenres, 1, sortByChoice, sortDirectionChoice)
      .then((result) => {
        this.setState({
          collection: result,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          genres: result.totalForEachGenre
        }, () => this.getCountOfResultsShown())
      }).catch(err => console.error(err));

  };

  // Takes in an object and then passes it up to App.js to delete it and then rerenders with componentDidUpdate
  deleteAlbums = (objectForDeletion) => {
    const { deleteAllTheseAlbums } = this.props;
    deleteAllTheseAlbums(objectForDeletion);
  }

  // sets the state of the collectionChoice for use later, passes in the actual id to the function
  changeCollectionState = (e) => {
    const tempChosenCollectionId = e.target.value;
    this.showChosenCollection(tempChosenCollectionId);
    this.setState({ collectionChoice: tempChosenCollectionId });

  };

  handleCheckbox = (e) => {
    const tempGenres = { ...this.state.checkedGenres }
    tempGenres[e.target.id] = e.target.checked;
    this.setState({
      checkedGenres: tempGenres
    })
  }

  resetCheckboxes = () => {
    const { collection, sortByChoice, sortDirectionChoice } = this.state;
    const genreSearched = {};
    this.setState({ genres: defaultGenres })
    genreRequests.getAllGenres()
      .then((results) => {
        results.forEach((genre) => {
          genreSearched[genre.id] = true;
        })
        collectionRequests.searchCollection(this.state.searchTerm, collection.id, genreSearched, 1, sortByChoice, sortDirectionChoice)
          .then((result) => {
            this.setState({ genres: result.totalForEachGenre });
          })

        let checkboxes = {};
        results.forEach((result) => {
          checkboxes[result.id] = false
        })
        this.setState({ checkedGenres: checkboxes })
      })
      .catch(err => console.error(err));
  }

  setCheckboxes = () => {
    const { collection } = this.state;
    // sets the initial state of the checkboxes, gets all products available for each category
    // and sets each checkbox to a false value
    genreRequests.getAllGenres()
      .then((results) => {
        results.forEach((genre) => {
          genreRequests.getTotalForEachGenreByCollection(genre.id, collection.id)
            .then((result) => genre.totalAlbums = result.totalAlbums)
        })
        this.setState({ genres: results });
        let checkboxes = {};
        results.forEach((result => {
          checkboxes[result.id] = false
        }))
        this.setState({ checkedGenres: checkboxes })
      })
      .catch(err => console.error(err));
  }

  // Passes in an object to App.js to add albums to a selected subcollection
  addAlbumToSubCollection = (objToAdd) => {
    const { addSelectedAlbumsToSubCollection } = this.props;
    addSelectedAlbumsToSubCollection(objToAdd);
  }

  searchThisTerm = (term) => {
    const { checkedGenres } = this.state;
    this.displaySearchedCollection(term, checkedGenres, 1)
  }
  // sets state of the collection by what results come up from the search bar
  displaySearchedCollection = (term, genres, page) => {
    const { collection, sortByChoice, sortDirectionChoice } = this.state;
    this.setState({ searchedTerm: term });
    collectionRequests.searchCollection(term, collection.id, genres, page, sortByChoice, sortDirectionChoice)
      .then((result) => {
        this.setState({
          collection: result,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          genres: result.totalForEachGenre
        }, () => this.getCountOfResultsShown())
      }).catch(err => console.error(err));
  };

  changePage = (page) => {
    const { searchedTerm, checkedGenres } = this.state;
    this.displaySearchedCollection(searchedTerm, checkedGenres, page);
  }

  sortStateChange = (sortType) => {
    const { searchedTerm, checkedGenres } = this.state;
    this.setState({ sortByChoice: sortType }, () => {
      this.displaySearchedCollection(searchedTerm, checkedGenres, 1)
    });
  }

  sortDirectionStateChange = (direction) => {
    const { searchedTerm, checkedGenres } = this.state;
    this.setState({ sortDirectionChoice: direction }, () => {
      this.displaySearchedCollection(searchedTerm, checkedGenres, 1)
    });
  }
  render() {
    const { userObj, collections } = this.props;
    const { collection, collectionChoice, searchedTerm, totalPages, currentPage, genres, checkedGenres, bottomNumber, topNumber } = this.state;

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
        <div className="row justify-content-center">
          <FormGroup className="col-12 row justify-content-center">
            <div className="col-6">
              <Label for="collectionChoice"></Label>
              <Input
                type="select"
                name="collectionChoice"
                id="collectionChoice"
                bsSize="sm"
                value={collectionChoice}
                onChange={this.changeCollectionState}
              >
                {returnOptions()}

              </Input>
            </div>
          </FormGroup>
          <div className="col-12 row">
            <CollectionSearchBar
              displaySearchedCollection={this.displaySearchedCollection}
              collectionChoice={collectionChoice}
              collection={collection}
              searchThisTerm={this.searchThisTerm}
              genres={genres}
              checkedGenres={checkedGenres}
              resetCheckboxes={this.resetCheckboxes}
              handleCheckbox={this.handleCheckbox}
            />
            <div className="col-3 row">
              <CollectionSortBtn
                sortStateChange={this.sortStateChange}
              />
              <CollectionSortDirectionSelect
                sortDirectionStateChange={this.sortDirectionStateChange}
              />
            </div>
          </div>
          <div className="col-12">

            {totalPages > 1 ?
              <AddAlbumPagination
                currentPage={currentPage}
                totalPages={totalPages}
                changePage={this.changePage}
              />
              : ''}
          </div>
          <p className="col-12">{bottomNumber} - {topNumber} of {collection.numberInCollection} results</p>
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
