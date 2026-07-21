import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjI6bybr1jxXNDNIi2ilOSnAxiA5cEHh8",
  authDomain: "captialblindsshades.firebaseapp.com",
  projectId: "captialblindsshades",
  storageBucket: "captialblindsshades.firebasestorage.app",
  messagingSenderId: "754386245463",
  appId: "1:754386245463:web:34337440ffeb115f151012",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const col = collection(db, "services");
  const snap = await getDocs(col);

  console.log(`Found ${snap.docs.length} existing services. Deleting...`);
  for (const doc of snap.docs) {
    await deleteDoc(doc.ref);
  }

  const newServices = [
    { title: "Roller Blinds", desc: "Sleek and modern roller blinds designed to provide optimal light control and privacy.", importantWords: ["Sleek and modern", "light control and privacy"], iconName: "PanelTop", color: "#001F3F", order: 1 },
    { title: "Plantation Shutters", desc: "Premium quality shutters crafted for elegance, durability, and excellent insulation.", importantWords: ["Premium quality shutters", "elegance, durability"], iconName: "Store", color: "#D4AF37", order: 2 },
    { title: "Motorised Solutions", desc: "State-of-the-art smart home automation for your window furnishings.", importantWords: ["smart home automation"], iconName: "Zap", color: "#001F3F", order: 3 },
    { title: "Sheer Curtains", desc: "Elegant sheer curtains that diffuse light and add a touch of luxury.", importantWords: ["diffuse light", "luxury"], iconName: "FileImage", color: "#D4AF37", order: 4 },
    { title: "Blockout Curtains", desc: "Complete privacy and light control with premium blockout fabrics.", importantWords: ["Complete privacy", "light control"], iconName: "Square", color: "#001F3F", order: 5 },
    { title: "Expert Installation", desc: "Our experienced fitters ensure your blinds and shutters are installed perfectly the first time.", importantWords: ["experienced fitters", "installed perfectly"], iconName: "HardHat", color: "#D4AF37", order: 6 }
  ];

  for (const svc of newServices) {
    await addDoc(col, svc);
  }
  console.log("Services seeded successfully!");
  process.exit(0);
}

run().catch(console.error);
