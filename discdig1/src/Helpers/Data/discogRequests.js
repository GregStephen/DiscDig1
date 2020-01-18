import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/discog';

const searchAlbums = (searchTerm) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/${searchTerm}`)
  .then(result => resolve(result.data))
  .catch(err => reject(err));
});

const getAlbumById = (id) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/album/${id}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err));
})
export default { searchAlbums, getAlbumById };
