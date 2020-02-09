import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

class CollectionSortBtn extends React.Component {

  changeSortState = (e) => {
    const {sortStateChange} = this.props;
    sortStateChange(e.target.value);
  };

  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <Label for="sortByChoice">Sort By</Label>
            <Input
              type="select"
              name="select"
              id="sortByChoice"
              onChange={this.changeSortState}>
              <option value='Artist'>Artist</option>
              <option value='Title'>Album Title</option>
              <option value='Year'>Year Released</option>
            </Input>
          </FormGroup>
        </Form>
      </div>
    )
  }
};

export default CollectionSortBtn;
