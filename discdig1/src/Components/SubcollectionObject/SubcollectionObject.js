import React from 'react';
import { Card, CardTitle, CardText, Button } from 'reactstrap';
import './SubcollectionObject.scss';

class SubcollectionObject extends React.Component {
  deleteSubcolleciton = () => {
    const { deleteThisSub, subCollection } = this.props;
    deleteThisSub(subCollection.id);
  };
  
  render() {
    const {subCollection} = this.props;
    return (
      <div className="SubcollectionObject row">
        <Card body className="col-4">
          <CardTitle>{subCollection.name}</CardTitle>
          <CardText>Number of Albums: {subCollection.numberInCollection} </CardText>
          <Button className="btn-danger" onClick={this.deleteSubcolleciton}>Delete</Button>
        </Card>
      </div>
    )
  }
}

export default SubcollectionObject;
