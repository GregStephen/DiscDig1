import React from 'react';
import {
  Media, Input, Label
  } from 'reactstrap';

import './CollectionAlbum.scss';

class CollectionAlbum extends React.Component {
state = {
  alreadyAddedToSub: false,
}

getAlreadyAddedStatus = () => {
  const { collections, chosenSubcollectionId, album } = this.props;
  const selectedCol = collections.filter(collection => collection.id === chosenSubcollectionId);
  const albumsList = selectedCol.albums;
  if (albumsList !== undefined) 
  {
    if (albumsList.some(singleAlbum => singleAlbum.discogId === album.id)) {
      this.setState({ alreadyAddedToSub: true })
    }
    console.error(selectedCol)
  }
};

  componentDidMount() {
    this.getAlreadyAddedStatus();

  };

  componentDidUpdate({ chosenSubcollectionId }) {
    if (this.props.chosenSubcollectionId !== chosenSubcollectionId) {
      this.getAlreadyAddedStatus()
    }
  };
  
  render() {
   const {album, isChecked, onCheck} = this.props;
    return (
      <div className="CollectionAlbum col-5 container">
        <Media className="row">
          <Media left className="col-7">
            <Media className="album-img" object src={album.imgUrl} alt={album.title}/>
          </Media>
          <Media body className="col-5">
            <Media heading>
            {album.title}
            </Media>
            <p>{album.artist}</p>
            <p>Label: {album.label}</p>
            <p>Released: {album.releaseYear}</p>
            <Label check>
              <Input
              type="checkbox"
              id= { album.id }
              name= { album.title }
              onChange= { onCheck }
              checked= { !!isChecked }
              />
            </Label>
          </Media>
        </Media>
      </div>
    )
  }
};

export default CollectionAlbum;
