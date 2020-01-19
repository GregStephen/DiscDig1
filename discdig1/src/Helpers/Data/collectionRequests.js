import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/collection';

const addAlbumToMainCollection = albumObj => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}`, albumObj)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
})

export default {addAlbumToMainCollection};
