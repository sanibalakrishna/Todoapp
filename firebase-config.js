import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Add your configuration
  apiKey: "AIzaSyAVGUgpE0_CYI5f1BjNOBCFBUt7wVn1pPo",
  authDomain: "todoapp-2046e.firebaseapp.com",
  projectId: "todoapp-2046e",
  storageBucket: "todoapp-2046e.appspot.com",
  messagingSenderId: "124099180167",
  appId: "1:124099180167:web:230c9cd7b4ef2b8f302a22",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
