import React from 'react';
import {
  Media,
  } from 'reactstrap';

import './CollectionAlbum.scss';

class CollectionAlbum extends React.Component {

  render() {
   const {album} = this.props;
    return (
      <div className="CollectionAlbum col-5">
        <Media>
          <Media left>
            <Media className="album-img" object src={album.imgUrl} alt={album.title}/>
          </Media>
          <Media body>
            <Media heading>
            {album.title}
            </Media>
            <p>{album.artist}</p>
            <p>Label: {album.label}</p>
            <p>Released: {album.releaseYear}</p>
          </Media>
        </Media>
      </div>
    )
  }
};

export default CollectionAlbum;
