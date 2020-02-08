import React from 'react';
import { Card, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';

class AlbumCompanies extends React.Component {
  render() {
    const { companies } = this.props;
    const showCompanies = companies.map((company, i) => (
      <ListGroupItem key={i}>{company.entity_type_name}: {company.name} </ListGroupItem>
    ));

    return (
      <div className="AlbumCompanies">
        <Card>
          <CardTitle>Companies</CardTitle>
          <ListGroup>
            {showCompanies}
          </ListGroup>
        </Card>
      </div>
    )
  }
};

export default AlbumCompanies;
