import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm_7xuxwVHNfqx-xXczGpN7UWMtFJzZ9g",
  authDomain: "chat-app-92816.firebaseapp.com",
  databaseURL: "https://chat-app-92816-default-rtdb.firebaseio.com",
  projectId: "chat-app-92816",
  storageBucket: "chat-app-92816.appspot.com",
  messagingSenderId: "201958027933",
  appId: "1:201958027933:web:d36adf4a9151180e035a74"
};


firebase.initializeApp(firebaseConfig);


export const db = firebase.database()
export const auth = firebase.auth();
export const storage = firebase.storage();
export const store = firebase.firestore();

export default firebase