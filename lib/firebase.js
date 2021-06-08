import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpTe3pna4x531g2wQvTcDbpRD5H66BQvs",
  authDomain: "quotesadmin-7b39a.firebaseapp.com",
  projectId: "quotesadmin-7b39a",
  storageBucket: "quotesadmin-7b39a.appspot.com",
  messagingSenderId: "207027300425",
  appId: "1:207027300425:web:ff05d50d813c0b08327798",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
