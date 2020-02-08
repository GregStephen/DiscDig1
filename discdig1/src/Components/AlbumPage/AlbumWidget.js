import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'reactstrap';

class AlbumWidget extends React.Component {
  render() {
    const { album } = this.props;
    const images = album.images;
    const image = images.find(image => image.type === "primary");
    const displayArtists = album.artists.map((artist, i) => {
      if (i === 0) {
        return `${artist.name}`
      }
      else {
        return `, ${artist.name}`
      }
    });
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

    const showLabel = album.labels.map((label, i) => {
      if (i === 0) {
        return `${label.name}`
      }
      else {
        return `, ${label.name}`
      }
    });

    return (
      <div className="AlbumWidget row">
        <Card>
          <div className="image-holder col-12">
            <img className="album-image" src={image.resource_url} alt={album.title}></img>
          </div>
          <div className="col-12">
            <ListGroup>
              <ListGroupItem>Artist(s): {displayArtists}</ListGroupItem>
              <ListGroupItem>Genre: {showGenres}</ListGroupItem>
              <ListGroupItem>Style: {showStyles}</ListGroupItem>
              <ListGroupItem>Label: {showLabel}</ListGroupItem>
              <ListGroupItem>Country: {album.country}</ListGroupItem>
              <ListGroupItem>Released: {album.released}</ListGroupItem>
            </ListGroup>
          </div>
        </Card>
      </div>
    )
  }
};

export default AlbumWidget;
