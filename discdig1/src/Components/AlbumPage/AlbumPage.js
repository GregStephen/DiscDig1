import React from 'react';
import { CardColumns } from 'reactstrap';
import AlbumCompanies from './AlbumCompanies';
import AlbumWidget from './AlbumWidget';
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
  companies: [
    {
      entity_type_name: '',
      name: ''
    }
  ],
  country: '',
  genres: [],
  images: [
    {
      resource_url: '',
      type: 'primary',
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
    return (
      <div className="AlbumPage container">
        <p className="album-title">{album.title}</p>
          <CardColumns>
            <AlbumWidget
              album={album}
            />
            <TrackList
              tracklist={album.tracklist}
            />
            <AlbumCompanies
              companies={album.companies}
            />
          </CardColumns>
      </div>
    )
  }
};

export default AlbumPage;
