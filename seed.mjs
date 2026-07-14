import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXXlsfqqnpVBatj5qWEHn0y2xNMON8Ut4",
  authDomain: "cprint-2bd05.firebaseapp.com",
  projectId: "cprint-2bd05",
  storageBucket: "cprint-2bd05.firebasestorage.app",
  messagingSenderId: "1065821483747",
  appId: "1:1065821483747:web:eca6bc9122acb8db81cbd6",
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
    { title: "Flyers & Brochures", desc: "High-impact marketing materials printed to perfection to promote your business effectively.", importantWords: ["High-impact marketing materials"], iconName: "ImageIcon", color: "#2d9cdb", order: 1 },
    { title: "Posters", desc: "Vibrant, sharp posters in any size for retail promotions, events, and in-store advertising.", importantWords: ["Vibrant, sharp", "retail promotions"], iconName: "FileImage", color: "#C2188B", order: 2 },
    { title: "Business Cards", desc: "Premium quality business cards in a range of finishes — matte, gloss, soft-touch, and foil.", importantWords: ["Premium quality", "matte, gloss, soft-touch, and foil"], iconName: "Printer", color: "#E6A623", order: 3 },
    { title: "Graphic Design", desc: "Our in-house creative team designs stunning artwork that perfectly captures your brand identity.", importantWords: ["in-house creative team", "stunning artwork"], iconName: "LayoutPanelLeft", color: "#E6A623", order: 4 }
  ];

  for (const svc of newServices) {
    await addDoc(col, svc);
  }
  console.log("Services seeded successfully!");
  process.exit(0);
}

run().catch(console.error);
