import axios from 'axios';

const baseUrl = 'https://localhost:44370/api/collection';

const addAlbumToMainCollection = albumObj => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}`, albumObj)
    .then(results => resolve(results.data))
    .catch(err => reject(err));
});

const getUsersMainCollection = userId => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/${userId}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err));
});

const getAllUsersCollectionsByUserId = userId => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/allCollections/${userId}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err));
});

const getUsersSubCollections = userId => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/subcollections/${userId}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err))
});

const getCollectionById = id => new Promise((resolve, reject) => {
  if (id !== '') {
    axios.get(`${baseUrl}/id/${id}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err))
  }
});

const deleteTheseAlbumsFromCollection = objectForDeletion => new Promise((resolve, reject) => {
  axios.delete(`${baseUrl}`, {params: objectForDeletion, headers: {"Content-Type": "application/json"}, data: objectForDeletion})
    .then(result => resolve(result.data))
    .catch(err => reject(err));
});

const addNewSubcollection = newSubInfo => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}/newsub`, newSubInfo)
    .then(result => resolve(result.data))
    .catch(err => reject(err))
});

const addAlbumsToSubcollection = albumAddObj => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}/addtosubcollection`, albumAddObj)
    .then(result => resolve(result.data))
    .catch(err => reject(err))
});

const deleteThisSubcollection = id => new Promise((resolve, reject) => {
  axios.delete(`${baseUrl}/sub/${id}`)
    .then(result => resolve(result.data))
    .catch(err => reject(err));
});

export default {
  addAlbumToMainCollection,
  getUsersMainCollection,
  getAllUsersCollectionsByUserId,
  getUsersSubCollections,
  getCollectionById,
  deleteTheseAlbumsFromCollection,
  addNewSubcollection,
  addAlbumsToSubcollection,
  deleteThisSubcollection,
};
