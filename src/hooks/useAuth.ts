import { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, setDoc, getDoc } from '../services/firebaseService';
import { UserProfile } from '../models/types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            weight: 70,
            height: 170,
            proteinGoal: 140,
            multiplier: 2.0,
            autoCalculate: true,
            weightUnit: 'kg',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest-123',
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
    setUser(guestUser);
    setLoading(false);
  };

  return { user, loading, loginAsGuest };
}
