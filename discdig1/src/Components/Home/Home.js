import React from 'react';

import Collection from '../Collection/Collection';

import './Home.scss';

class Home extends React.Component {
  render() {
    const {userObj} = this.props;
    return (
      <div className="Home container">
        <h1>Home</h1>
        <h2>Hey {userObj.firstName}</h2>
        <Collection
        userObj = {userObj}
        />
      </div>
    )
  }
};

export default Home;
