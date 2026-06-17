// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBbSaoRBR_MhjotMJPrmW_2I-hpErRGXAA',
  authDomain: 'lets-intern.firebaseapp.com',
  projectId: 'lets-intern',
  storageBucket: 'lets-intern.appspot.com',
  messagingSenderId: '32999696717',
  appId: '1:32999696717:web:3438d67d2fbe8452c0af04',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;
