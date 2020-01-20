import React from 'react';

import CollectionAlbum from '../CollectionAlbum/CollectionAlbum';

import './Collection.scss';

import collectionRequests from '../../Helpers/Data/collectionRequests';
const defaultCollection = {
  albums :[],
  name : '',

}
class Collection extends React.Component{
  state = {
    collection : defaultCollection,
  }

  componentDidMount() {
    const {userObj} = this.props;
    collectionRequests.getUsersMainCollection(userObj.id)
      .then((result) => this.setState({collection: result }))
      .catch(err => console.error(err));
  }

  render() {
    const {collection} = this.state;
    const albums = collection.albums;
    const showCollection = albums.map((album, index) => (
      <CollectionAlbum
      album={ album }
      key={ index }
      />
    ))

    return (
      <div className="Collection container">
        <p>{collection.name}</p>
        <div className="row justify-content-around">
        {showCollection}
        </div>
      </div>
    )
  }
};

export default Collection;
