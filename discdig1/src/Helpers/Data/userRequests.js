import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/user';

const getUserByFirebaseUid = uid => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/uid/${uid}`)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
});

const addNewUser = userobj => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}`, userobj)
    .then(results => resolve(results.data))
    .catch(err => reject(err))
});

export default { getUserByFirebaseUid, addNewUser };
