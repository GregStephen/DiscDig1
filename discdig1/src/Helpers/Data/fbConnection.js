import firebase from 'firebase/app';
import constants from '../apiKeys.json';

const firebaseApp = () => {
  firebase.initializeApp(constants.firebaseKeys);
};

export default firebaseApp;
