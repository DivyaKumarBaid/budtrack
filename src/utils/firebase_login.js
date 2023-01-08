import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_BASE_API_KEY,
    authDomain: process.env.REACT_APP_BASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_BASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_BASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_BASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_BASE_APP_ID,
    measurementId: process.env.REACT_APP_BASE_MEASUREMENT_ID
};

console.log(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, provider };