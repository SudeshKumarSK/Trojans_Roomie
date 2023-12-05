// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "trojan-roomie.firebaseapp.com",
  projectId: "trojan-roomie",
  storageBucket: "trojan-roomie.appspot.com",
  messagingSenderId: "1085818598245",
  appId: "1:1085818598245:web:9d3294c56e29f922abe78c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);