import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9LcSM4BdF9jCeyzAmMO3aCXnfq11V4iE",
  authDomain: "bamboochain-official.firebaseapp.com",
  projectId: "bamboochain-official",
  storageBucket: "bamboochain-official.firebasestorage.app",
  messagingSenderId: "969704302314",
  appId: "1:969704302314:web:78083a2d6718c8aa23d993",
  measurementId: "G-6H1WD6VJ41"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
