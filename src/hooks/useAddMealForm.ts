import { useState, useEffect } from 'react';
import { UserProfile, Meal, Screen } from '../models/types';
import { db, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from '../services/firebaseService';

export const useAddMealForm = (user: UserProfile, initialMeal?: Meal | null, onNavigate?: (screen: Screen) => void) => {
  const [name, setName] = useState(initialMeal?.name || '');
  const [protein, setProtein] = useState<number>(initialMeal?.protein || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialMeal) {
      setName(initialMeal.name);
      setProtein(initialMeal.protein);
    }
  }, [initialMeal]);

  const handleSave = async () => {
    if (!name || protein <= 0) return;
    setIsLoading(true);
    try {
      if (initialMeal?.id) {
        await updateDoc(doc(db, 'users', user.uid, 'meals', initialMeal.id), {
          name,
          protein,
        });
      } else {
        await addDoc(collection(db, 'users', user.uid, 'meals'), {
          name,
          protein,
          timestamp: serverTimestamp(),
        });
      }
      if (onNavigate) onNavigate('dashboard');
    } catch (error) {
      console.error("Error saving meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialMeal?.id) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'meals', initialMeal.id));
      if (onNavigate) onNavigate('dashboard');
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setQuickFood = (food: { name: string; protein: number }) => {
    setName(food.name);
    setProtein(food.protein);
  };

  return {
    name,
    setName,
    protein,
    setProtein,
    isLoading,
    handleSave,
    handleDelete,
    setQuickFood,
  };
};
