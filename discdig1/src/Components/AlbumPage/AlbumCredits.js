import React from 'react';
import { Card, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';


class AlbumCredits extends React.Component {
  state = {
    formatedCredits: {
      role: ['']
    }
  }

  separateCredits = (credits) => {
    let creditObject = {};
    credits.forEach((credit) => {
      if (credit.role in creditObject) {
        const array = creditObject[credit.role];
        array.push(credit.name);
      }
      else {
        const newArray = [credit.name];
        creditObject[credit.role] = newArray;
      }
    })
    this.setState({ formatedCredits: creditObject })
  }

  componentDidUpdate({ albumCredits }) {
    if (this.props.albumCredits !== albumCredits) {

      this.separateCredits(this.props.albumCredits);
    }
  };
  render() {
    const { formatedCredits } = this.state;

    const showNames = (namesArray) => {
      return namesArray.map((name, i) => {
        if (i === 0) {
          return `${name}`
        }
        else {
          return `, ${name}`
        }
      })
    };

    const showCredits = Object.keys(formatedCredits).map((creditKey, i) => (
      <ListGroupItem key={i}>
        {creditKey} : {showNames(formatedCredits[creditKey])}
      </ListGroupItem>
    ))

    return (
      <div className="AlbumCredits">
        <Card>
          <CardTitle>Credits</CardTitle>
          <ListGroup>
            {showCredits}
          </ListGroup>
        </Card>
      </div>
    )
  }
};

export default AlbumCredits;
