import { useState, useEffect } from 'react';
import { db, onSnapshot, collection, query, orderBy, limit } from '../services/firebaseService';
import { Meal } from '../models/types';

export function useMeals(userId: string | undefined) {
  const [meals, setMeals] = useState<Meal[]>([]);

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

  return { meals };
}
