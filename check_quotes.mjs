import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXXlsfqqnpVBatj5qWEHn0y2xNMON8Ut4",
  authDomain: "cprint-2bd05.firebaseapp.com",
  projectId: "cprint-2bd05",
  storageBucket: "cprint-2bd05.firebasestorage.app",
  messagingSenderId: "1065821483747",
  appId: "1:1065821483747:web:eca6bc9122acb8db81cbd6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkQuotes() {
  const qSnap = await getDocs(collection(db, "quotes"));
  console.log("Total quotes in DB:", qSnap.size);
}

checkQuotes().catch(console.error);
