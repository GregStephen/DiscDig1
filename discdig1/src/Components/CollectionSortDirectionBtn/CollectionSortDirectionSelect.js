import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

class CollectionSortDirectionSelect extends React.Component {

  changeSortDirectionState = (e) => {
    const { sortDirectionStateChange } = this.props;
    sortDirectionStateChange(e.target.value);
  };

  render() {
    return (
      <div className="col-5">
        <Form>
          <FormGroup>
            <Label for="sortByDirectionChoice"></Label>
            <Input
              type="select"
              name="select"
              bsSize="sm"
              id="sortByDirectionChoice"
              onChange={this.changeSortDirectionState}>
              <option value='ASC'>ASC</option>
              <option value='DESC'>DESC</option>
            </Input>
          </FormGroup>
        </Form>
      </div>
    )
  }
};

export default CollectionSortDirectionSelect;