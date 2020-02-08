import React from 'react';
import { Table } from 'reactstrap';

class TrackList extends React.Component {
  render() {
    const { tracklist } = this.props;
    const createTableBody = tracklist.map((track) => (
      <tr>
        <th scope="row">{track.position}</th>
        <td>{track.title}</td>
      </tr>
    ))

    return (
      <div className="TrackList">
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
      </div>
    )
  }
};

export default TrackList;
