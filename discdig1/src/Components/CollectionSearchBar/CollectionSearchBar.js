import React from 'react';
import { Input, InputGroup, InputGroupAddon, Button, Form, Collapse, FormGroup } from 'reactstrap';

import GenreCheckBox from '../GenreCheckBox/GenreCheckBox';

import genreRequests from '../../Helpers/Data/genreRequests';
import collectionRequests from '../../Helpers/Data/collectionRequests';

import './CollectionSearchBar.scss';

const defaultGenres = [
  {
    id: '0',
    name: '',
    totalAlbums: 0
  }
];

const defaultCheckedGenres = {
 0: false
}

class CollectionSearchBar extends React.Component {
  _isMounted = false;

  state = {
    searchTerm : "",
    genres: defaultGenres,
    collapse: false,
    status: 'Closed',
    checkedGenres: defaultCheckedGenres
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
    this.resetCheckboxes();
  }

  // this searches the database when the user clicks on the search button
  searchOnSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.searchTerm);
  }

  // this is the actual search function
  search = (term) => {
    const { displaySearchedCollection, collection } = this.props;
    const { checkedGenres } = this.state;
    collectionRequests.searchCollection(term, collection.id, checkedGenres)
    .then((result) => {
      displaySearchedCollection(result, term)
      this.setState({ genres: result.totalForEachGenre })
    }).catch(err => console.error(err)); 
  }

  // When the user types on the search bar it changes state and searches
  formFieldStringState = (e) => {
    this.setState({ searchTerm: e.target.value });
    this.search(e.target.value);
  }
  
    // this is for the checkboxes
    handleChange = (e) => {
      const tempGenres = { ...this.state.checkedGenres }
      tempGenres[e.target.id] = e.target.checked;
      this.setState({
        checkedGenres: tempGenres
      })
    }

   // this should reset the checkboxes when the button is clicked so they are no longer checked
   resetCheckboxes = () => {
     const {collection} = this.props;
     this.setState({ genres: defaultGenres })
    genreRequests.getAllGenres()
      .then((results) => {
      results.forEach((genre) => {
        const genreSearched = {};
        genreSearched[genre.id] = true;
        collectionRequests.searchCollection(this.state.searchTerm, collection.id, genreSearched)
        .then((result) => {
          genre.totalAlbums = result.totalAlbums;
        })
      })
      this.setState({ genres: results})
      let checkboxes = {};
      results.forEach((result) => {
        checkboxes[result.id] = false
      })
      this.setState({ checkedGenres: checkboxes})
    })
      .catch(err => console.error(err));
  }

  setCheckboxes = () => {
    const {collection} = this.props;
    // sets the initial state of the checkboxes, gets all products available for each category
    // and sets each checkbox to a false value
    genreRequests.getAllGenres()
      .then((results) => {
        results.forEach((genre) => {
          console.error(genre, 'genre')
          genreRequests.getTotalForEachGenreByCollection(genre.id, collection.id)
          .then((result) => genre.totalAlbums = result.totalAlbums)
            })
        if (this._isMounted)
        {
          console.error('results', results)
          this.setState({ genres: results });
          let checkboxes = {};
          results.forEach((result => {
            checkboxes[result.id] = false
          })) 
          this.setState({ checkedGenres: checkboxes})
        }
      })
      .catch(err => console.error(err));
  }
  componentDidMount() {
    this._isMounted = true;
    this.setCheckboxes();
  }

  componentDidUpdate({ collection }) {
    if (this.props.collection !== collection) {
      this.setCheckboxes();
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { collection } = this.props;
    const { genres } = this.state;
    const makeCheckboxes = genres.map(genre => (
        <GenreCheckBox
        key={ genre.id }
        genre={ genre }
        onChange={ this.handleChange }
        isChecked={ this.state.checkedGenres[genre.id] }
        />
    ))
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
          {this.state.collapse 
          ? <Button className="btn btn-warning" onClick={this.removeFilter}>Remove Genre Filter</Button>
          : <Button className="btn btn-info" onClick={this.toggle}>Filter by Genre</Button>}
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
