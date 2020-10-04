import dotenv from "dotenv";

import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DB_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: "game-diary-img-upload.appspot.com",
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export { storage, firebase as default };