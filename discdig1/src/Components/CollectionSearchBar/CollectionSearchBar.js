import React from 'react';
import { Input, InputGroup, InputGroupAddon, Button, Form, Collapse, FormGroup } from 'reactstrap';

import GenreCheckBox from '../GenreCheckBox/GenreCheckBox';

import './CollectionSearchBar.scss';


class CollectionSearchBar extends React.Component {
  _isMounted = false;

  state = {
    searchTerm: "",
    collapse: false,
    status: 'Closed',
  }

  componentDidUpdate({ collectionChoice }) {
    if (this.props.collectionChoice !== collectionChoice) {
      this.setState( { collapse: false, status: 'Closed', searchTerm: '' });
    }
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  // when you close the category filters it clears out the checkboxes that have been clicked
  removeFilter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
    const {resetCheckboxes} = this.props;
    resetCheckboxes();
  }

  // this searches the database when the user clicks on the search button
  searchOnSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.searchTerm);
  }

  // this is the actual search function
  search = (term) => {
    const { searchThisTerm } = this.props;
    searchThisTerm(term);
  }

  // When the user types on the search bar it changes state and searches
  formFieldStringState = (e) => {
    this.setState({ searchTerm: e.target.value });
    this.search(e.target.value);
  }

  // this is for the checkboxes
  handleChange = (e) => {
    const {handleCheckbox} = this.props;
    handleCheckbox(e);
  }

  // this should reset the checkboxes when the button is clicked so they are no longer checked




  render() {
    const { collection, genres } = this.props;
    const makeCheckboxes = genres.map(genre => (
      <GenreCheckBox
        key={genre.id}
        genre={genre}
        onChange={this.handleChange}
        isChecked={this.props.checkedGenres[genre.id]}
      />
    ))
    return (
      <div className="CollectionSearchBar col-sm-12 col-lg-6">
        <Form onSubmit={this.searchOnSubmit}>
          {collection.id === undefined ?
            <InputGroup>
              <Input
                maxLength="40"
                type="search"
                name="searchTerm"
                id="searchTerm"
                value={this.state.searchTerm}
                placeholder='Please select a collection to search thru first'
                onChange={this.formFieldStringState} />
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
                onChange={this.formFieldStringState} />
              <InputGroupAddon addonType="append">
                <Button type="submit" className="searchBtn btn btn-success">Search</Button>
              </InputGroupAddon>
            </InputGroup>
          }
          {this.state.collapse
            ? <Button className="btn btn-warning genre-filter-btn" onClick={this.removeFilter}>Remove Genre Filter</Button>
            : <Button className="btn btn-info genre-filter-btn" onClick={this.toggle}>Filter by Genre</Button>}
          <Collapse
            className="no-transition"
            isOpen={this.state.collapse}
            onEntering={this.onEntering}
            onEntered={this.onEntered}
            onExiting={this.onExiting}
            onExited={this.onExited}
          >
            <FormGroup check className="row">
              {makeCheckboxes}
            </FormGroup>
          </Collapse>
        </Form>
      </div>
    )
  }
}

export default CollectionSearchBar;
