import axios from 'axios';

const baseUrl = 'https://discdig.azurewebsites.net/api/genre';

const getAllGenres = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}`)
    .then((results) => resolve(results.data))
    .catch((err) => reject(err));
});

const getTotalForEachGenreByCollection = (
  genreId,
  collectionId,
) => new Promise((resolve, reject) => {
  if (collectionId !== undefined) {
    axios.get(`${baseUrl}/collection=${collectionId}/genre=${genreId}`)
      .then((result) => resolve(result.data))
      .catch((err) => reject(err));
  }
});

export default { getAllGenres, getTotalForEachGenreByCollection };
