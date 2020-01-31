import React from 'react';
import { Input, Label } from 'reactstrap';

class GenreCheckBox extends React.Component{

  render() {
    const { genre, isChecked, onChange } = this.props;
    return(
      <div className="col-4">
        <Label check> 
          <Input
          type= "checkbox"
          id= { genre.id }
          name= { genre.name }
          onChange= { onChange }
          checked= { !!isChecked }
          />
          { genre.name } 
        </Label>
      </div>
    )
  }
}

export default GenreCheckBox;