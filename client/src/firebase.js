// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  //we are using import.meta because we're using Vite and not react app directly
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-551ec.firebaseapp.com",
  projectId: "mern-blog-551ec",
  storageBucket: "mern-blog-551ec.appspot.com",
  messagingSenderId: "855711970154",
  appId: "1:855711970154:web:0b62469d5c6918ee09ab13"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);