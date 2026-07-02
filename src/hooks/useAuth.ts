import { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, setDoc, getDoc, signOut, serverTimestamp } from '../services/firebaseService';
import { UserProfile } from '../models/types';

const GUEST_STORAGE_KEY = 'protein-check-guest-user';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Tentar recuperar sessão de visitante do localStorage
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
    if (savedGuest && !user) {
      try {
        setUser(JSON.parse(savedGuest));
      } catch (e) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se logar com Firebase, remove sessão de visitante
        localStorage.removeItem(GUEST_STORAGE_KEY);
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Usuário',
            email: firebaseUser.email || '', // Fallback para cumprir regras do Firestore
            photoURL: firebaseUser.photoURL,
            weight: 70,
            height: 170,
            proteinGoal: 140,
            multiplier: 2.0,
            autoCalculate: true,
            weightUnit: 'kg',
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          // Para o estado local, convertemos o timestamp para string ou mantemos como está
          setUser({ ...newUser, createdAt: new Date().toISOString() });
        }
      } else if (!localStorage.getItem(GUEST_STORAGE_KEY)) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 9),
      displayName: 'Visitante',
      email: 'visitante@exemplo.com',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
      weight: 70,
      height: 170,
      proteinGoal: 140,
      multiplier: 2.0,
      autoCalculate: true,
      weightUnit: 'kg',
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, loginAsGuest, logout };
}
