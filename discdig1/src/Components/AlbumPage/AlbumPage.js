import React from 'react';

import TrackList from './TrackList';

import discogRequests from '../../Helpers/Data/discogRequests';

import './AlbumPage.scss';

const defaultAlbum = {
  title: '',
  artists: [
    {
      name: '',
      id: 0
    }
  ],
  companies: [],
  country: '',
  genres: [],
  images: [
    {
      resource_url: '',
      type: '',
    }
  ],
  labels: [
    {
      name: ''
    }
  ],
  released: '',
  styles: [],
  tracklist: [
    {
      position: '',
      title: ''
    }
  ],
  year: 0
}

class AlbumPage extends React.Component {
  state = {
    album: defaultAlbum,
  };

  getAlbumInfo = () => {
    const albumId = this.props.match.params.id;
    discogRequests.getAlbumById(albumId)
      .then(result => this.setState({ album: result }))
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.getAlbumInfo();
  };

  render() {
    const { album } = this.state;
    const displayArtists = album.artists.map((artist) => (
      <li key={artist.id}>{artist.name}</li>
    ));
    const showGenres = album.genres.map((genre, i) => {
      if (i === 0) {
       return `${genre}`
      }
      else {
       return `, ${genre}`
      }
    });

    const showStyles = album.styles.map((style, i) => {
      if (i === 0) {
        return `${style}`
      }
      else {
        return `, ${style}`
      }
    });

    console.error(album);
    return (
      <div className="AlbumPage">
        <p>Album Page</p>
        <p>{album.title}</p>
        <ul>
          {displayArtists}
        </ul>
        <p>Released in {album.country}, {album.released}</p>
        <p>Genres: {showGenres}</p>
        <p>Styles: {showStyles}</p>
        <div className="tracks">
            <TrackList 
            tracklist = {album.tracklist}
            />
        </div>
      </div>
    )
  }
};

export default AlbumPage;
