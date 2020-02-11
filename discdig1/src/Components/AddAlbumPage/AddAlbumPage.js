import React from 'react';

import AddAlbumPagination from '../AddAlbumPagination/AddAlbumPagination';
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
    totalResults: 0,
    pagination: {},
    currentPage: 0,
    totalPages: 0,
    topNumber: 0,
    bottomNumber: 0,
  }

  componentDidMount() {
    this.getMainCollection();
  };

  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.getMainCollection();
    }
  };

  getMainCollection = () => {
    const { collections } = this.props;
    const main = collections.filter(collection => collection.name === 'Main');
    this.setState({ mainCollectionAlbums: main[0].albums });
  };

  displaySearchedAlbums = (artistSearch, albumSearch, page) => {
    this.setState({ artistTerm: artistSearch, albumTerm: albumSearch });
    discogRequests.searchAlbums(artistSearch, albumSearch, page)
      .then((results) => {
        const resultCheck = results.results;
        this.setState(
          {
            totalResults: results.pagination.items,
            pagination: results.pagination,
            currentPage: results.pagination.page,
            totalPages: results.pagination.pages
          })
        this.getCountOfResultsShown();
        if (resultCheck.length === 0) {
          this.setState({ artists: [], albums: [] })
        }
        else if (resultCheck[0].type === "release") {
          this.setState({ albums: results.results, artists: [] });
        }
        else if (resultCheck[0].type === "artist") {
          this.setState({ artists: results.results, albums: [] })
        }
      })
      .catch(err => console.error(err))
  };

  getCountOfResultsShown = () => {
    const { currentPage, totalResults, pagination } = this.state;
    const perPage = pagination.per_page;
    let topNumber = (currentPage * perPage);
    const bottomNumber = (topNumber - (perPage - 1));
    if (topNumber > totalResults) {
      topNumber = totalResults;
    }
    this.setState({ bottomNumber, topNumber })
  };

  getAlbumsByThisArtist = (artistName) => {
    const albumSearch = 'searchAll';
    this.setState({ albumTerm: 'searchAll', artistTerm: artistName })
    this.displaySearchedAlbums(artistName, albumSearch, 1);
  };

  addAlbToMain = (albumToAdd) => {
    const { addThisAlbumToMain } = this.props;
    addThisAlbumToMain(albumToAdd);
  };

  changePage = (page) => {
    const { artistTerm, albumTerm } = this.state;
    this.displaySearchedAlbums(artistTerm, albumTerm, page);
  }

  render() {
    const { albums, artists, totalResults, currentPage, totalPages, topNumber, bottomNumber } = this.state;
    const showAlbums = albums.map(album => (
      <Album
        key={album.id}
        album={album}
        userObj={this.props.userObj}
        addAlbToMain={this.addAlbToMain}
        mainCollectionAlbums={this.state.mainCollectionAlbums}
      />
    ))

    const showArtists = artists.map(artist => (
      <Artist
        key={artist.id}
        artist={artist}
        getAlbumsByThisArtist={this.getAlbumsByThisArtist}
      />
    ))


    const showResults = () => {
      const { albums, artists } = this.state;
      let result = ""
      if (albums.length !== 0) {
        result = 'album'
      }
      else if (artists.length !== 0) {
        result = 'artist'
      }
      else {
        result = 'no result'
      }
      let returnCode = '';
      if (result === 'no result'){
      returnCode = <h2 className="no-result">No results! Please refine search</h2> }
      else {
        returnCode =
        <div className="album-display row justify-content-around">
          <div className="row col-12 justify-content-center">
            <p className="col-12">{bottomNumber} - {topNumber} of {totalResults} results</p>
            {totalPages > 1 ?
              <AddAlbumPagination
                currentPage={currentPage}
                totalPages={totalPages}
                changePage={this.changePage}
              />
              : ''}
          </div>
            {result === 'album' ? showAlbums : result === 'artist' ? showArtists : ''}
            <div className="row col-12 justify-content-center">
            {totalPages > 1 ?
              <AddAlbumPagination
                currentPage={currentPage}
                totalPages={totalPages}
                changePage={this.changePage}
              />
              : ''}
          </div>
        </div>
      }

      return returnCode;
    };


    return (
      <div className="AddAlbumPage container">
        <p className="add-album-title">Search by artist name, album name, or both</p>
        <SearchBar
          displaySearchedAlbums={this.displaySearchedAlbums} />
        {showResults()}
      </div>
    )
  }
};

export default AddAlbumPage;
