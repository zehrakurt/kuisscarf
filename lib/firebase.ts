import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0Au9AjS3ZQ0kmZdcg9Vwd4r_snJO4eug",
  authDomain: "kuisscarf-7383e.firebaseapp.com",
  projectId: "kuisscarf-7383e",
  storageBucket: "kuisscarf-7383e.firebasestorage.app",
  messagingSenderId: "774018525813",
  appId: "1:774018525813:web:195564995adbfc5fcfe63c",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
