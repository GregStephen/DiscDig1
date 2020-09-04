import React from 'react';
import { Media, Button } from 'reactstrap';
import './Artist.scss';

class Artist extends React.Component {
  searchThisArtist = () => {
    const { artist, getAlbumsByThisArtist } = this.props;
    getAlbumsByThisArtist(artist.title);
  }

  render() {
    const { artist } = this.props;
    let thumb = 'https://image.flaticon.com/icons/svg/767/767455.svg';
    if (artist.thumb !== '') {
      thumb = artist.thumb;
    }
    return (
      <div className="Artist col-12 col-lg-5">
        <Media>
          <Media left>
            <Media className="artist-img" object src={thumb} alt={artist.title} />
          </Media>
          <Media body>
            <Media heading>
              {artist.title}
            </Media>
            <Button onClick={this.searchThisArtist} className="albums-by-btn">View Albums by this Artist</Button>
          </Media>
        </Media>
      </div>
    );
  }
}

export default Artist;
