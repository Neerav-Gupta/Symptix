import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc, collection } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDQ335Za9OxuziyuJ6XS-a_4w8wW8AaV7A",
    authDomain: "symptix.firebaseapp.com",
    projectId: "symptix",
    storageBucket: "symptix.appspot.com",
    messagingSenderId: "917225201517",
    appId: "1:917225201517:web:fc7bc7d9b6d13d47e20464",
    measurementId: "G-9KJW06VEC1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { db, auth, collection, doc, deleteDoc };