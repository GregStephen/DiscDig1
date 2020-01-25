import React from 'react';

import Album from '../Album/Album';
import SearchBar from '../SearchBar/SearchBar';

import discogRequests from '../../Helpers/Data/discogRequests';

import './AddAlbumPage.scss';

class AddAlbumPage extends React.Component {
  state = {
    albums: [],
    mainCollectionAlbums: []
  }

  componentDidMount () {
    const { collections }= this.props;
    const main = collections.filter(collection => collection.name === 'Main');
    this.setState({mainCollectionAlbums: main[0].albums });

  }
  displaySearchedAlbums = (artistSearch, albumSearch) => {
    discogRequests.searchAlbums(artistSearch, albumSearch)
      .then((results) => {
        this.setState({ albums: results.results });
        console.error(results);
      })
      .catch(err => console.error(err))
  }

  addAlbToMain = (albumToAdd) => {
    const { addThisAlbumToMain } = this.props;
    addThisAlbumToMain(albumToAdd);
  };
  
  render() {
    const { albums } = this.state;
    const showAlbums = albums.map(album => (
        <Album
        key={ album.id }
        album={ album }
        userObj={ this.props.userObj}
        addAlbToMain={ this.addAlbToMain }
        mainCollectionAlbums={ this.state.mainCollectionAlbums }
        />
    ))
    return (
      <div className="AddAlbumPage container">
        <h1>Add Album Page</h1>
        <SearchBar
        displaySearchedAlbums= { this.displaySearchedAlbums }/>
        <div className="row justify-content-around">
          { 
          albums.length === 0 ? <h2>Refine Search</h2> 
          : showAlbums
          }
        </div>
      </div>
    )
  }
};

export default AddAlbumPage;
