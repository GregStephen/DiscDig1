import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/avatar';

const getAllAvatars = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}`)
  .then(result => resolve(result.data))
  .catch(err => reject(err));
});

export default { getAllAvatars };
