'use client'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../firebase.js";
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export function validateEmail(email:string):string{
    if(email.trim() === '') return "Email is required.";
    if(!email.includes('@')) return "Email is invalid.";
    return '';
}

export function validatePassword(password: string): string {
    if (password.trim() === '') return "Password is required.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    return '';
}

export async function signInCheck(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      return false;
    }
}

export async function signUpCheck(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log(user, user.uid)
  
      // 建立會員資料到 Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });
  
      return { success: true, data: { uid: user.uid } };
    } catch (error) {
    //   console.error("Sign up error:", error);
      return { success: false, data: {message: (error as Error).message} };
    }
}

export async function logOutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
}

export interface UserData {
    uid: string;
    email: string;
}

export function useUser(){
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const fireStoreData = userSnap.data();
                    setUserData({
                        ...fireStoreData,
                        uid: user.uid,
                    } as UserData);
                } else {
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    
    return { userData, isLoading };
}