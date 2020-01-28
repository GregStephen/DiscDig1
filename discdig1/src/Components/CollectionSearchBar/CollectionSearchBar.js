import React from 'react';
import { Input, InputGroup, InputGroupAddon, Button, Form } from 'reactstrap';

import './CollectionSearchBar.scss';
import collectionRequests from '../../Helpers/Data/collectionRequests';

class CollectionSearchBar extends React.Component {
  _isMounted = false;

  state = {
    searchTerm : "",
  }

  // this searches the database when the user clicks on the search button
  searchOnSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.searchTerm);
  }

  // this is the actual search function
  search = (term) => {
    const { displaySearchedCollection, collection } = this.props;
    collectionRequests.searchCollection(term, collection.id)
    .then((result) => {
      displaySearchedCollection(result, term)
    }).catch(err => console.error(err)); 
  }

  // When the user types on the search bar it changes state and searches
  formFieldStringState = (e) => {
    this.setState({ searchTerm: e.target.value });
    this.search(e.target.value);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { collection } = this.props;
    return (
      <div className="CollectionSearchBar col-6">
        <Form onSubmit={this.searchOnSubmit}>
          { collection.id === undefined ?      
          <InputGroup>
            <Input 
            maxLength="40"
            type="search"
            name="searchTerm"
            id="searchTerm"
            value={this.state.searchTerm}
            placeholder='Please select a collection to search thru first'
            onChange={this.formFieldStringState}/>
            <InputGroupAddon addonType="append">
              <Button disabled type="submit" className="searchBtn btn btn-success">Search</Button>
            </InputGroupAddon>
          </InputGroup> 
          :
          <InputGroup>
            <Input 
            maxLength="40"
            type="search"
            name="searchTerm"
            id="searchTerm"
            value={this.state.searchTerm}
            placeholder='Search artist or album name'
            onChange={this.formFieldStringState}/>
            <InputGroupAddon addonType="append">
              <Button type="submit" className="searchBtn btn btn-success">Search</Button>
            </InputGroupAddon>
          </InputGroup>
          }
        </Form>
      </div>
    )
  }
}

export default CollectionSearchBar;
