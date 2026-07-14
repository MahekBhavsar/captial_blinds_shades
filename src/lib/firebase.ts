// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXlsfqqnpVBatj5qWEHn0y2xNMON8Ut4",
  authDomain: "cprint-2bd05.firebaseapp.com",
  projectId: "cprint-2bd05",
  storageBucket: "cprint-2bd05.firebasestorage.app",
  messagingSenderId: "1065821483747",
  appId: "1:1065821483747:web:eca6bc9122acb8db81cbd6",
  measurementId: "G-07QPJ8C3TK"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics is only available in browser environments
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Helper to create typed collections
import { collection, DocumentData, QueryDocumentSnapshot, SnapshotOptions, FirestoreDataConverter } from "firebase/firestore";
import type { UserDocument, QuoteDocument, PortfolioDocument, TestimonialDocument, BlogPostDocument, ServiceDocument } from "./schema";

const createConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => snapshot.data(options) as T,
});

// Typed Collections
const collections = {
  users: collection(db, "users").withConverter(createConverter<UserDocument>()),
  quotes: collection(db, "quotes").withConverter(createConverter<QuoteDocument>()),
  portfolio: collection(db, "portfolio").withConverter(createConverter<PortfolioDocument>()),
  testimonials: collection(db, "testimonials").withConverter(createConverter<TestimonialDocument>()),
  blogPosts: collection(db, "blogPosts").withConverter(createConverter<BlogPostDocument>()),
  services: collection(db, "services").withConverter(createConverter<ServiceDocument>()),
};

export { app, db, auth, storage, analytics, collections };
