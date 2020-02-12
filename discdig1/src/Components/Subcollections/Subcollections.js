import React from 'react';
import { Button, Collapse, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import SubcollectionObject from '../SubcollectionObject/SubcollectionObject';

import './Subcollections.scss';

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

  componentDidUpdate({ collections }) {
    if (this.props.collections !== collections) {
      this.loadPage();
    }
  };

  loadPage = () => {
    const { collections } = this.props;
    const subs = collections.filter(collection => collection.name !== 'Main');
    this.setState({ subCollections: subs });
  };

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
    const { newSubcollection } = this.state;
    const { userObj, createNewSubColl } = this.props;
    const toSend = {};
    toSend.userId = userObj.id;
    toSend.subCollectionName = newSubcollection;
    createNewSubColl(toSend).then(() => {
      this.toggle();
      this.loadPage();
      this.setState({ newSubcollection: '' });
    })
  }

  deleteThisSub = (subId) => {
    const { deleteSub } = this.props;
    deleteSub(subId).then(this.loadPage());
  }

  changeSubColName = (subObj) => {
    const { changeSubName } = this.props;
    changeSubName(subObj).then(this.loadPage());
  }

  render() {
    const { subCollections } = this.state;
    const createSubcollectionList = subCollections.map((subCollection) => (
      <SubcollectionObject
        key={subCollection.id}
        subCollection={subCollection}
        deleteThisSub={this.deleteThisSub}
        changeSubColName={this.changeSubColName}
      />
    ))
    return (
      <div className="Subcollections container">
        <Button className="btn-info" onClick={this.toggle}>Add New Subcollection</Button>
        <div className='new-sub-input row justify-content-center'>
          <Collapse
            className="no-transition col-6"
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
                  name="newSubcollectionName"
                  id="newSubcollectionName"
                  value={this.state.newSubcollection}
                  onChange={this.newSubcollectionNameChange} />
                <InputGroupAddon addonType="append">
                  <Button type="submit" className="searchBtn btn btn-success">Create</Button>
                </InputGroupAddon>
              </InputGroup>
            </Form>
          </Collapse>
        </div>


        <div className="subcollections-list row">
          {subCollections.length > 0 ?
          createSubcollectionList
        : <p className="no-subcollections col-12">You don't have any subcollections yet. Click above to create one!</p>}
        </div>


      </div>
    )
  }
};

export default Subcollections;
