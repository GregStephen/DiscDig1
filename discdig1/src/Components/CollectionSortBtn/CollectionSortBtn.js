import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

class CollectionSortBtn extends React.Component {

  changeSortState = (e) => {
    const { sortStateChange } = this.props;
    sortStateChange(e.target.value);
  };

  render() {
    return (
      <div className="CollectionSortBtn col-7">
        <Form>
          <FormGroup>
            <Label for="sortByChoice"></Label>
            <Input
              type="select"
              name="select"
              id="sortByChoice"
              bsSize="sm"
              onChange={this.changeSortState}>
              <option value='Artist'>Artist</option>
              <option value='Title'>Album Title</option>
              <option value='Year'>Year</option>
            </Input>
          </FormGroup>
        </Form>
      </div>
    )
  }
};

export default CollectionSortBtn;
