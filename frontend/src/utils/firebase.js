import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import config from './config';

const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSANING_SENDER_ID,
    appId: config.APP_ID
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);