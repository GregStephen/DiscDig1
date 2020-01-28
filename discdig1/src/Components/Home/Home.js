import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

import Collection from '../Collection/Collection';
import CollectionSearchBar from '../CollectionSearchBar/CollectionSearchBar';

import collectionRequests from '../../Helpers/Data/collectionRequests';

import './Home.scss';


const defaultCollection = {
  albums :[],
  name : '',
};

class Home extends React.Component {
  state = {
    collection: defaultCollection,
    subCollections: [],
    collectionChoice: '',
    searchedTerm: ''
  };

  componentDidMount(){
    const { collections } = this.props;
    const subs = collections.filter(collection => collection.name !== 'Main');
    this.setState({subCollections: subs });
  };

  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.showChosenCollection(this.state.collectionChoice);
    }
  };

  showChosenCollection = (choice) => {
    collectionRequests.getCollectionById(choice)
    .then(result => this.setState({collection: result}))
    .catch(err => console.error(err));
  };

  deleteAlbums = (objectForDeletion) => {
    const {deleteAllTheseAlbums} = this.props;
    deleteAllTheseAlbums(objectForDeletion)
      .then(this.showChosenCollection(this.state.collectionChoice));
  }

  changeCollectionState = (e) => {
    const tempChosenCollectionId = e.target.value;
    this.setState({ collectionChoice: tempChosenCollectionId });
    this.showChosenCollection(tempChosenCollectionId);
  };

  addAlbumToSubCollection = (objToAdd) => {
    const {addSelectedAlbumsToSubCollection} = this.props;
    addSelectedAlbumsToSubCollection(objToAdd);
  }

  displaySearchedCollection = (results, term) => {
    this.setState({ collection: results, searchedTerm: term })
  }

  render() {
    const { userObj, collections }= this.props;
    const { collection, collectionChoice, searchedTerm }= this.state;

    return (
      <div className="Home container">
        <h2>Hey {userObj.firstName}</h2>
        <div className="row  justify-content-center">
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
        { collections.map(subCollection => (
          <option key={subCollection.id} value={subCollection.id}>{subCollection.name} ({subCollection.numberInCollection})</option>
        )) }
        </Input>
      </FormGroup>
   
      <CollectionSearchBar
      displaySearchedCollection= { this.displaySearchedCollection }
      collection= { collection }
      />
      </div>
        <Collection
        userObj={ userObj }
        collection={ collection }
        searchedTerm={ searchedTerm }
        deleteAlbums={ this.deleteAlbums }
        addAlbumToSubCollection={ this.addAlbumToSubCollection }
        collections={ this.props.collections }
        />
      </div>
    )
  }
};

export default Home;
