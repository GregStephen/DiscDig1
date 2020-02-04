import React from 'react';

import Album from '../Album/Album';
import Artist from '../Artist/Artist';
import SearchBar from '../SearchBar/SearchBar';

import discogRequests from '../../Helpers/Data/discogRequests';

import './AddAlbumPage.scss';

class AddAlbumPage extends React.Component {
  state = {
    albums: [],
    artists: [],
    mainCollectionAlbums: [],
    albumTerm: '',
    artistTerm: '',
  }

  componentDidMount () {
  this.getMainCollection();
  };

  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.getMainCollection();
    }
  };
  
  getMainCollection = () => {
    const { collections }= this.props;
    const main = collections.filter(collection => collection.name === 'Main');
    this.setState({mainCollectionAlbums: main[0].albums });
  };

  displaySearchedAlbums = (artistSearch, albumSearch) => {
    discogRequests.searchAlbums(artistSearch, albumSearch)
      .then((results) => {
        const resultCheck = results.results;
        if (resultCheck.length === 0)
        {
          this.setState({ artists: [], albums: [] })
        }     
        else if(resultCheck[0].type === "release")
        {
          this.setState({ albums: results.results, artists: [] });
        }
        else if (resultCheck[0].type === "artist")
        {
          this.setState({ artists: results.results, albums: [] })
        }

      })
      .catch(err => console.error(err))
  };

  getAlbumsByThisArtist = (artistName) => {
    const albumSearch = 'searchAll';
    this.displaySearchedAlbums(artistName, albumSearch);
  };

  addAlbToMain = (albumToAdd) => {
    const { addThisAlbumToMain } = this.props;
    addThisAlbumToMain(albumToAdd);
  };
  
  render() {
    const { albums, artists } = this.state;
    const showAlbums = albums.map(album => (
        <Album
        key={ album.id }
        album={ album }
        userObj={ this.props.userObj}
        addAlbToMain={ this.addAlbToMain }
        mainCollectionAlbums={ this.state.mainCollectionAlbums }
        />
    ))

    const showArtists = artists.map(artist => (
      <Artist
      key={ artist.id }
      artist={ artist }
      getAlbumsByThisArtist={ this.getAlbumsByThisArtist }
      />

    ))
    return (
      <div className="AddAlbumPage container">
        <p className="add-album-title">Search by artist name, album name, or both</p>
        <SearchBar
        displaySearchedAlbums= { this.displaySearchedAlbums }/>
        <div className="album-display row justify-content-around">
          { 
          albums.length !== 0 ?
          showAlbums 
          : artists.length !== 0 ?
          showArtists
          : <h2>No results! Please refine search</h2> 
          }
        </div>
      </div>
    )
  }
};

export default AddAlbumPage;
