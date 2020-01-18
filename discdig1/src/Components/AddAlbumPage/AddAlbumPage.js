import React from 'react';

import Album from '../Album/Album';
import SearchBar from '../SearchBar/SearchBar';

import discogRequests from '../../Helpers/Data/discogRequests';

import './AddAlbumPage.scss';

class AddAlbumPage extends React.Component {
  state = {
    albums: []
  }

  displaySearchedAlbums = (artistSearch, albumSearch) => {
    discogRequests.searchAlbums(artistSearch, albumSearch)
      .then((results) => {
        this.setState({ albums: results.results });
        console.error(results);
      })
      .catch(err => console.error(err))
  }
  render() {
    const { albums } = this.state;
    const showAlbums = albums.map(album => (
        <Album
        key={ album.id }
        album={ album }
        />
    ))
    return (
      <div className="AddAlbumPage container">
        <h1>Add Album Page</h1>
        <SearchBar
        displaySearchedAlbums= { this.displaySearchedAlbums }/>
        <div className="row">
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
