import React from 'react';
import { Button, Collapse, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import collectionRequests from '../../Helpers/Data/collectionRequests';

import './Subcollections.scss';
import SubcollectionObject from '../SubcollectionObject/SubcollectionObject';

class Subcollections extends React.Component {
  state = {
    subCollections: [],
    newSubcollection: '',
    collapse: false,
    status: 'Closed',
  }

  componentDidMount() {
    this.loadPage();
  };

  loadPage = () => {
    const { collections } = this.props;
    const subs = collections.filter(collection => collection.name !== 'Main');
    this.setState({subCollections: subs });
  };

  getUsersSubCollections = () => {
    const { userObj } = this.props;
    collectionRequests.getUsersSubCollections(userObj.id)
      .then(result => this.setState({subCollections: result}))
      .catch(err => console.error(err));
  }
  onEntering = () => {
    this.setState({ status: 'Opening...' });
  }

  onEntered = () => {
    this.setState({ status: 'Opened' });
  }

  onExiting = () => {
    this.setState({ status: 'Closing...' });
  }

  onExited = () => {
    this.setState({ status: 'Closed' });
  }

  toggle = () => {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  newSubcollectionNameChange = (e) => {
    this.setState({ newSubcollection: e.target.value })
  };

  createNewSubcollection = (e) => {
    e.preventDefault();
    const {newSubcollection} = this.state;
    const {userObj} = this.props;
    const toSend = {};
    toSend.userId = userObj.id;
    toSend.subCollectionName = newSubcollection;
    collectionRequests.addNewSubcollection(toSend)
      .then(() => {
        this.toggle();
        this.getUsersSubCollections();
      })
      .catch(err=> console.error(err));
  }

  deleteThisSub = (subId) => {
    const {deleteSub} = this.props;
    deleteSub(subId);
    this.loadPage();
  }

  render() {
    const {subCollections} = this.state;
    const createSubcollectionList = subCollections.map((subCollection) => (
      <SubcollectionObject
      key={ subCollection.id }
      subCollection={ subCollection }
      deleteThisSub={ this.deleteThisSub }
      />
    ))
    return (
      <div className="Subcollections container">
        <Button className="btn-info" onClick={this.toggle}>Add New Subcollection</Button>
        <Collapse
          className="no-transition"
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
          >
            <Form onSubmit={this.createNewSubcollection}>
              <InputGroup>
                <Input 
                maxLength="30"
                type="text"
                name="searchTerm"
                id="searchTerm"
                value={this.state.newSubcollection}
                onChange={this.newSubcollectionNameChange}/>
                <InputGroupAddon addonType="append">
                  <Button type="submit" className="searchBtn btn btn-success">Create</Button>
                </InputGroupAddon>
              </InputGroup>
            </Form>
          </Collapse>
        {createSubcollectionList}

      </div>
    )
  }
};

export default Subcollections;
