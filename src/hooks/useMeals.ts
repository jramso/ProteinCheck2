import { useState, useEffect } from 'react';
import { db, onSnapshot, collection, query, orderBy, limit } from '../services/firebaseService';
import { Meal, SugestaoConsumo } from '../models/types';

export function useMeals(userId: string | undefined) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [suggestions, setSuggestions] = useState<SugestaoConsumo[]>([]);

  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, 'users', userId, 'meals'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const mealData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Meal[];
        setMeals(mealData);
      }, (error) => {
        console.error("Firestore Error: ", JSON.stringify({
          error: error.message,
          operationType: 'get',
          path: `users/${userId}/meals`,
          authInfo: { userId }
        }));
      });
      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !userId.startsWith('guest-')) {
      const q = query(
        collection(db, 'users', userId, 'suggestions'),
        orderBy('updatedAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sugData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SugestaoConsumo[];
        setSuggestions(sugData);
      }, (error) => {
        console.error("Firestore Error suggestions: ", JSON.stringify({
          error: error.message,
          operationType: 'get',
          path: `users/${userId}/suggestions`,
          authInfo: { userId }
        }));
      });
      return () => unsubscribe();
    } else {
      setSuggestions([]);
    }
  }, [userId]);

  return { meals, suggestions };
}
