import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/user';

axios.interceptors.request.use(function (request) {
  const token = sessionStorage.getItem('token');

  if (token != null) {
      request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
}, function (err) {
  return Promise.reject(err);
});

const getUserByFirebaseUid = uid => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/uid/${uid}`)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
});

const getUserById = uid => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/${uid}`)
      .then(result => resolve(result.data))
      .catch(err => reject(err));
});

const addNewUser = userobj => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}`, userobj)
    .then(results => resolve(results.data))
    .catch(err => reject(err))
});

const getUserDashboardData = userId => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/dashboard/${userId}`)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
});

const editUser = (editedUser) => new Promise((resolve, reject) => {
  axios.put(`${baseUrl}`, editedUser)
      .then(result => resolve(result.data))
      .catch(err => reject(err));
});

const deleteUser = (id) => new Promise((resolve, reject) => {
  axios.delete(`${baseUrl}/${id}`)
    .then(results => resolve(results.data))
    .catch(err => reject(err))
});

const changeAvatar = (avatarObj) => new Promise((resolve, reject) => {
  console.error(avatarObj);
  axios.put(`${baseUrl}/changeAvatar`, avatarObj)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
});

export default {
  getUserByFirebaseUid,
  getUserById,
  addNewUser,
  getUserDashboardData,
  editUser,
  deleteUser,
  changeAvatar
};
