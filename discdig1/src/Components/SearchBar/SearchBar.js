import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Form } from 'reactstrap';

import './SearchBar.scss';


class SearchBar extends React.Component {
  _isMounted = false;

  static propTypes = {
    displaySearchedAlbums: PropTypes.func.isRequired,
  };

  state = {
    artistSearch : "",
    albumSearch : "",
  }

  // this searches the database when the user clicks on the search button
  searchOnSubmit = (e) => {
    e.preventDefault();
    const {artistSearch, albumSearch} = this.state;
    this.search(artistSearch, albumSearch);
  }

  // this is the actual search function
  search = (artistSearch, albumSearch) => {
    const {displaySearchedAlbums} = this.props;
    if (artistSearch === ''){
      artistSearch = 'null'
    }
    if (albumSearch === '') {
      albumSearch = 'null'
    }

    displaySearchedAlbums(artistSearch, albumSearch); 
  }

  // When the user types on the search bar it changes state and searches
  formFieldStringState = (e) => {
    this.setState({ [e.target.id] : e.target.value });
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
      <div className="SearchBar container">
        <Form onSubmit={this.searchOnSubmit} className="row">
            <Input 
            className="col-sm-12 col-lg-4 offset-lg-1"
            maxLength="40"
            type="search"
            name="artistSearch"
            id="artistSearch"
            placeholder="artist"
            value={this.state.artistSearch}
            onChange={this.formFieldStringState}/>
            <Input 
            className="col-sm-12 col-lg-4 offset-lg-1"
            maxLength="40"
            type="search"
            name="albumSearch"
            id="albumSearch"
            placeholder="album"
            value={this.state.albumSearch}
            onChange={this.formFieldStringState}/>
            <Button type="submit" className="searchBtn btn btn-success col-1 offset-1">Search</Button>
        </Form>
      </div>
    )
  }
}

export default SearchBar;