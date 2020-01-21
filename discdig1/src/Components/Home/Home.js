import React from 'react';

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
  };

  getMainCollection = () => {
    const {userObj} = this.props;
    collectionRequests.getUsersMainCollection(userObj.id)
    .then((result) => this.setState({collection: result }))
    .catch(err => console.error(err));
  }
  componentDidMount(){
   this.getMainCollection();
  };

  deleteAlbums = (objectForDeletion) => {
    collectionRequests.deleteTheseAlbumsFromCollection(objectForDeletion)
      .then(() => this.getMainCollection())
      .catch(err => console.error(err))
  }
  render() {
    const { userObj }= this.props;
    const { collection }= this.state;
    return (
      <div className="Home container">
        <h1>Home</h1>
        <h2>Hey {userObj.firstName}</h2>
        <Collection
        userObj= { userObj }
        collection= { collection }
        deleteAlbums= { this.deleteAlbums }
        />
      </div>
    )
  }
};

export default Home;
