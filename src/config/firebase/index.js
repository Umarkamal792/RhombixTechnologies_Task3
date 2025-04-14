// src/config/firebase/index.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Random user ID generator
function generateRandomId() {
  return Math.floor(Math.random() * 999) + 1;
}


export async function register(userInfo) {
  try {
    const { email, password, age, fullname } = userInfo;
    const userId = generateRandomId();

    await createUserWithEmailAndPassword(auth, email, password);

    await addDoc(collection(db, "users"), {
      userId,
      fullname,
      age,
      email,
    });

    alert("Successfully Registered!");
    return true;
  } catch (e) {
    alert(e.message);
    throw e;
  }
}

// 🔐 Login user
export async function login(userInfo) {
  try {
    const { email, password } = userInfo;
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged In Successfully");
    return true;
  } catch (e) {
    alert(e.message);
    throw e; 
  }
}

// Logout user
export async function logout() {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
  } catch (e) {
    alert(e.message);
  }
}

// Get all user profiles
export async function getProfile() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error fetching profiles", error);
    return [];
  }
}

// Save borrowed book
export async function borrowBook(book, email) {
  try {
    // Check how many books are already borrowed
    const borrowed = await getBorrowedBooks(email);
    if (borrowed.length >= 2) {
      alert("You can only borrow a maximum of 2 books.");
      return;
    }

    await addDoc(collection(db, "borrowedBooks"), {
      title: book.title,
      authors: book.authors || [],
      email,
      timestamp: new Date().toISOString()
    });

    alert("Book borrowed successfully!");
  } catch (error) {
    console.error("Error borrowing book:", error);
    alert("Failed to borrow book");
  }
}

// Get user's borrowed books
export async function getBorrowedBooks(email) {
  try {
    const q = query(collection(db, "borrowedBooks"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return [];
  }
}

// Return borrowed book
export async function returnBook(email, title) {
  try {
    const q = query(
      collection(db, "borrowedBooks"),
      where("email", "==", email),
      where("title", "==", title)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // Delete the borrowed book record from Firestore
      await deleteDoc(doc.ref);
      console.log("Book returned successfully!");
    });
  } catch (error) {
    console.error("Error returning book:", error);
    alert("Failed to return book");
  }
}

// Track authenticated user
export function trackUserState(callback) {
  onAuthStateChanged(auth, callback);
}
