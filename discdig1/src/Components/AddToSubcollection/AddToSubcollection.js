/* eslint-disable max-len */
import React from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';

import collectionRequests from '../../Helpers/Data/collectionRequests';

import './AddToSubcollection.scss';

class AddToSubcollection extends React.Component {
  state = {
    chosenSubcollectionId: '',
    subCollections: [],
  }

  componentDidMount() {
    this.getSubCollectionWithOutMainChoice();
  }

  getSubCollectionWithOutMainChoice = () => {
    const { userObj, collection } = this.props;
    collectionRequests.getUsersSubCollections(userObj.id)
      .then((result) => {
        const withoutMainChoiceAvailable = result.filter((res) => res.id !== collection.id);
        this.setState({ subCollections: withoutMainChoiceAvailable });
      })
      .catch((err) => console.error(err));
  }

  componentDidUpdate({ collection }) {
    if (this.props.collection !== collection) {
      this.getSubCollectionWithOutMainChoice();
    }
  }

  addToThisSubcollection = (e) => {
    e.preventDefault();
    const { chosenSubcollectionId } = this.state;
    const { addToSubcollection } = this.props;
    addToSubcollection(chosenSubcollectionId);
  };

  changeCollectionState = (e) => {
    const { changeSubCollection } = this.props;
    changeSubCollection(e);
    const tempChosenCollectionId = e.target.value;
    this.setState({ chosenSubcollectionId: tempChosenCollectionId });
  };

  render() {
    const { chosenSubcollectionId, subCollections } = this.state;
    return (
      <div className="row">

        <Form onSubmit={this.addToThisSubcollection} className="col">
          <FormGroup>
            <Label for="chosenSubcollectionId"></Label>
            <Input
              type="select"
              name="chosenSubcollectionId"
              id="chosenSubcollectionId"
              value={chosenSubcollectionId}
              onChange={this.changeCollectionState}
            >
              <option value=''>Choose a subcollection</option>
              {subCollections.map((subCollection) => (
                <option key={subCollection.id} value={subCollection.id}>{subCollection.name}</option>
              ))}
            </Input>
          </FormGroup>
          {this.state.chosenSubcollectionId === '' ? ''
            : <Button className="subcollection-btn" type="submit">Add Selected to this Subcollection</Button>
          }
        </Form>
      </div>
    );
  }
}

export default AddToSubcollection;
