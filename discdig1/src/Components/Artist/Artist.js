import React from 'react';
import { Media, Button } from 'reactstrap'
import './Artist.scss';

class Artist extends React.Component {
  searchThisArtist = () => {
    const { artist, getAlbumsByThisArtist } = this.props;
    getAlbumsByThisArtist(artist.title);
  }

  render() {
    const {artist} = this.props;
    return (
      <div className="Artist col-5">
      <Media>
        <Media left>
          <Media className="artist-img" object src={artist.thumb} alt={artist.title}/>
        </Media>
        <Media body>
          <Media heading>
          {artist.title}
          </Media>
          <Button onClick={this.searchThisArtist}>View Albums by this Artist</Button>
        </Media>
      </Media>
    </div>
    )
  }
};

export default Artist;
