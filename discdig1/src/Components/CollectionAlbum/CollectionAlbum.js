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
          <Media left className="col-8 row">
            <Media className="album-img col-12" object src={album.imgUrl} alt={album.title}/>
             <div className="col-12">
              <Label check>
                <Input
                type="checkbox"
                id= { album.id }
                name= { album.title }
                onChange= { onCheck }
                checked= { !!isChecked }
                />
              </Label>
              </div>
          </Media>
          <Media body className="col-4">
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
