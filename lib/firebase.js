import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB21AJ8DNPQlEZt5uOSBXB30v5xlQiW2LU",
    authDomain: "cash-account-form.firebaseapp.com",
    projectId: "cash-account-form",
    storageBucket: "cash-account-form.appspot.com",
    messagingSenderId: "387442810500",
    appId: "1:387442810500:web:67c1c6560680b3808aacd1"
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