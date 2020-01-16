import React from 'react';

import './Home.scss';

class Home extends React.Component {
  render() {
    const {userObj} = this.props;
    return (
      <div className="Home">
        <h1>Home</h1>
        <h2>Hey {userObj.firstName}</h2>
      </div>
    )
  }
};

export default Home;
