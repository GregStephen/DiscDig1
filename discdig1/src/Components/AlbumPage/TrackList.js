import React from 'react';
import { Card, Table } from 'reactstrap';

class TrackList extends React.Component {
  render() {
    const { tracklist } = this.props;
    const createTableBody = tracklist.map((track, i) => (
      <tr key={i}>
        <th scope="row">{track.position}</th>
        <td>{track.title}</td>
      </tr>
    ))

    return (
      <div className="TrackList">
        <Card>
        <Table size="sm">
          <thead>
            <tr>
              <th>Track # </th>
              <th>Track Name</th>
            </tr>
          </thead>
          <tbody>
            {createTableBody}
          </tbody>
        </Table>
        </Card>
      </div>
    )
  }
};

export default TrackList;
