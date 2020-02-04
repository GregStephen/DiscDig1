import React from 'react';

import userRequests from '../../Helpers/Data/userRequests';

import './UserDashboard.scss';

const defaultDash = {
  topGenre: {},
  topArtist: {}
}

class UserDashboard extends React.Component {
  state = {
    dashboardData : defaultDash,
    topGenre: {},
    topArtist: {},
    genrePercentage: 0,
    artistPercentage: 0,
    mainCollection: {}
  };

  componentDidMount() {
    const { userObj, collections } = this.props;
    const main = collections.find(collection => collection.name === 'Main');
    userRequests.getUserDashboardData(userObj.id)
      .then((result) => {
        if (result !== null){
          const genre = result.topGenre;
          const artist = result.topArtist;
          const genrePercentage = this.getPercentage(main.numberInCollection, genre.totalInCollection);
          const artistPercentage = this.getPercentage(main.numberInCollection, artist.totalInCollection);
          this.setState({dashboardData: result, topGenre: genre, topArtist: artist, genrePercentage: genrePercentage, artistPercentage: artistPercentage, mainCollection: main})
        }}
        )
      .catch(err => console.error(err))
  }

  getPercentage = (total, part) => {
    let percentage = ((part / total) * 100)
    if (percentage % 1 !== 0) {
      percentage = percentage.toFixed(2)
    }
    return percentage;
  }

  render() {
    const { topGenre, topArtist, genrePercentage, artistPercentage, mainCollection } = this.state;

    return (
      <div className="UserDashboard">
        <h3>Here's some info on your collection</h3>
        {mainCollection.numberInCollection > 0 ? 
          <div>
            <p>Total collection: {mainCollection.numberInCollection}</p>
            <p>Most of your collection is: {topGenre.genre} </p>
            <p>Total {topGenre.genre} albums: {topGenre.totalInCollection} or { genrePercentage}% of your collection</p>
            <p>Top Artist Owned: {topArtist.artist}</p>
            <p>You own {topArtist.totalInCollection} {topArtist.totalInCollection > 1 ? 'albums' : 'album'} by {topArtist.artist} which is {artistPercentage}% of your collection</p>
          </div>
      : <p> You have nothing in your collection yet</p>}
  
      </div>
    )
  }
}

export default UserDashboard;
