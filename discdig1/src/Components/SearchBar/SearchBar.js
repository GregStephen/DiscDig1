import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon, Button, Form } from 'reactstrap';

import './SearchBar.scss';


class SearchBar extends React.Component {
  _isMounted = false;

  static propTypes = {
    displaySearchedAlbums: PropTypes.func.isRequired,
  };

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
    const {displaySearchedAlbums} = this.props;
    displaySearchedAlbums(term); 
  }

  // When the user types on the search bar it changes state and searches
  formFieldStringState = (e) => {
    this.setState({ searchTerm: e.target.value });
  //  this.search(e.target.value);
  }
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="SearchBar">
        <Form onSubmit={this.searchOnSubmit}>
          <InputGroup>
            <Input 
            maxLength="40"
            type="search"
            name="searchTerm"
            id="searchTerm"
            value={this.state.searchTerm}
            onChange={this.formFieldStringState}/>
            <InputGroupAddon addonType="append">
              <Button type="submit" className="searchBtn btn btn-success">Search</Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </div>
    )
  }
}

export default SearchBar;