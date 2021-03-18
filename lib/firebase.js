import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCkhUOalCumleedOfFPOcEwV4SxjKsAZbo",
    authDomain: "signature-log.firebaseapp.com",
    projectId: "signature-log",
    storageBucket: "signature-log.appspot.com",
    messagingSenderId: "725145673719",
    appId: "1:725145673719:web:68a89ebb92e688f3dd18f2"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;