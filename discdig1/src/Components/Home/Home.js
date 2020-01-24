import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import {Link} from 'react-router-dom';

import Collection from '../Collection/Collection';

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
    collectionChoice: ''
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


  render() {
    const { userObj, collections }= this.props;
    const { collection, collectionChoice }= this.state;

    return (
      <div className="Home container">
        <h1>Home</h1>
        <h2>Hey {userObj.firstName}</h2>
        <FormGroup>
        <Label for="collectionChoice">Collection</Label>
        <Input 
        type="select"
        name="collectionChoice"
        id="collectionChoice"
        value={collectionChoice}
        onChange={this.changeCollectionState}
        >
          <option value=''>Chose a collection to display</option>
        { collections.map(subCollection => (
          <option key={subCollection.id} value={subCollection.id}>{subCollection.name} ({subCollection.numberInCollection})</option>
        )) }
        </Input>
      </FormGroup>
      <Link className="btn btn-info" to='/subcollections'>Manage Subcollections</Link>
        <Collection
        userObj= { userObj }
        collection= { collection }
        deleteAlbums= { this.deleteAlbums }
        addAlbumToSubCollection= { this.addAlbumToSubCollection }
        />
      </div>
    )
  }
};

export default Home;
