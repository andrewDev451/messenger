import firebase from "firebase"
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOj_p-eKoOE2H1YjmGv9Gk9K2upYZ8J7A",
    authDomain: "messanger-e94d0.firebaseapp.com",
    databaseURL: "https://messanger-e94d0.firebaseio.com",
    projectId: "messanger-e94d0",
    storageBucket: "messanger-e94d0.appspot.com",
    messagingSenderId: "81330743875",
    appId: "1:81330743875:web:355a5a66d161b7d7eb02f6",
    measurementId: "G-W7GL0TRMXF"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const  provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;