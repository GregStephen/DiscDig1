import React from 'react';
import { Card, CardTitle, CardText, Button, Collapse, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import './SubcollectionObject.scss';

class SubcollectionObject extends React.Component {
  state = {
    subCollectionName: '',
    collapse: false,
    status: 'Closed',
  };

  componentDidMount() {
    const {subCollection} = this.props
    this.setState({subCollectionName: subCollection.name})
  };

  onEntering = () => {
    this.setState({ status: 'Opening...' });
  };

  onEntered = () => {
    this.setState({ status: 'Opened' });
  };

  onExiting = () => {
    this.setState({ status: 'Closing...' });
  };

  onExited = () => {
    this.setState({ status: 'Closed' });
  };

  toggle = () => {
    this.setState(state => ({ collapse: !state.collapse }));
  };


  deleteSubcollection = () => {
    const { deleteThisSub, subCollection } = this.props;
    deleteThisSub(subCollection.id);
  };

  changeSubcollectionName = (e) => {
    e.preventDefault();
    const {subCollectionName} = this.state;
    const {changeSubColName, subCollection} = this.props;
    const subObj = {
      newSubCollectionName: subCollectionName,
      collectionId: subCollection.id
    }
    changeSubColName(subObj);
    this.toggle();
  };
  
  subcollectionNameChange = (e) => {
    this.setState({ subCollectionName: e.target.value })
  };

  render() {
    const {subCollection} = this.props;
    const {subCollectionName, status} = this.state;
    return (
      <div className="SubcollectionObject col-sm-12 col-md-6 col-lg-4">
        <Card body className="sub-object-card">
        {status === 'Closed' ? <CardTitle className="subcollection-title">{subCollectionName}</CardTitle> : '' }
          <Collapse
          className="no-transition"
          isOpen={this.state.collapse}
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExiting={this.onExiting}
          onExited={this.onExited}
          >
            <Form onSubmit={this.changeSubcollectionName}>
              <InputGroup>
                <Input 
                maxLength="30"
                type="text"
                name={subCollection.id}
                id={subCollection.id}
                value={this.state.subCollectionName}
                onChange={this.subcollectionNameChange}/>
                <InputGroupAddon addonType="append">
                  <Button type="submit" className="searchBtn btn btn-success">edit</Button>
                </InputGroupAddon>
              </InputGroup>
            </Form>
          </Collapse>
          <CardText>Number of Albums: {subCollection.numberInCollection} </CardText>
          {status === 'Closed' ? <Button className="btn-info" onClick={this.toggle}>Change Name</Button>
          : ''}
          <Button className="btn-danger" onClick={this.deleteSubcollection}>Delete</Button>
        </Card>
      </div>
    )
  }
}

export default SubcollectionObject;
