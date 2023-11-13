import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCK-9UBRi7iZOoTM42U3Ihr5GrGY72Gr8c",
  authDomain: "trojanroommie.firebaseapp.com",
  projectId: "trojanroommie",
  storageBucket: "trojanroommie.appspot.com",
  messagingSenderId: "786000002506",
  appId: "1:786000002506:web:98383668b141c6be50a333",
  measurementId: "G-2CVNFRBLLK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
