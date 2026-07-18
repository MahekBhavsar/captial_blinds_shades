// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjI6bybr1jxXNDNIi2ilOSnAxiA5cEHh8",
  authDomain: "captialblindsshades.firebaseapp.com",
  databaseURL: "https://captialblindsshades-default-rtdb.firebaseio.com",
  projectId: "captialblindsshades",
  storageBucket: "captialblindsshades.firebasestorage.app",
  messagingSenderId: "754386245463",
  appId: "1:754386245463:web:34337440ffeb115f151012",
  measurementId: "G-1MVSQMCX8G"
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
