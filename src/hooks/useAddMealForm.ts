import { useState, useEffect } from 'react';
import { UserProfile, Meal, Screen, SugestaoConsumo } from '../models/types';
import { db, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, createSuggestion, updateSuggestion, deleteSuggestion } from '../services/firebaseService';

export const useAddMealForm = (user: UserProfile, initialMeal?: Meal | null, onNavigate?: (screen: Screen) => void) => {
  const [name, setName] = useState(initialMeal?.name || '');
  const [protein, setProtein] = useState<number>(initialMeal?.protein || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Suggestion specific states
  const [sugName, setSugName] = useState('');
  const [sugProtein, setSugProtein] = useState<number>(0);
  const [sugError, setSugError] = useState<string | null>(null);
  const [editingSuggestion, setEditingSuggestion] = useState<SugestaoConsumo | null>(null);

  // Consumption from suggestion specific states
  const [selectedSuggestion, setSelectedSuggestion] = useState<SugestaoConsumo | null>(null);
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);
  const [step, setStep] = useState<'form' | 'quantity'>('form');

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
          quantityMultiplier: selectedSuggestion ? quantityMultiplier : 1,
          suggestionId: selectedSuggestion ? (selectedSuggestion.id || null) : null,
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

  // CRUD for Suggestions
  const handleSaveSuggestion = async (): Promise<boolean> => {
    setSugError(null);
    if (!sugName.trim()) {
      setSugError('Nome é obrigatório.');
      return false;
    }
    if (sugProtein <= 0) {
      setSugError('Proteína deve ser maior que zero.');
      return false;
    }
    if (sugProtein > 500) {
      setSugError('Proteína não deve exceder 500g.');
      return false;
    }

    setIsLoading(true);
    try {
      if (editingSuggestion?.id) {
        const res = await updateSuggestion(user.uid, editingSuggestion.id, sugName, sugProtein);
        if (!res.success) {
          setSugError(res.error?.message || 'Erro ao atualizar sugestão.');
          return false;
        }
      } else {
        const res = await createSuggestion(user.uid, sugName, sugProtein);
        if (!res.success) {
          setSugError(res.error?.message || 'Erro ao criar sugestão.');
          return false;
        }
      }
      setSugName('');
      setSugProtein(0);
      setEditingSuggestion(null);
      return true;
    } catch (error: any) {
      setSugError('Erro de persistência.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditSuggestion = (sug: SugestaoConsumo) => {
    setEditingSuggestion(sug);
    setSugName(sug.name);
    setSugProtein(sug.proteinPerPortion);
    setSugError(null);
  };

  const handleCancelEditSuggestion = () => {
    setEditingSuggestion(null);
    setSugName('');
    setSugProtein(0);
    setSugError(null);
  };

  const handleDeleteSuggestionClick = async (sugId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await deleteSuggestion(user.uid, sugId);
      if (!res.success) {
        setSugError(res.error?.message || 'Erro ao excluir sugestão.');
        return false;
      }
      return true;
    } catch (error) {
      setSugError('Erro de persistência.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Consume flow from Suggestion
  const handleSelectSuggestion = (sug: SugestaoConsumo) => {
    setSelectedSuggestion(sug);
    setName(sug.name);
    setQuantityMultiplier(1.0);
    setProtein(sug.proteinPerPortion);
    setStep('quantity');
  };

  const handleConfirmQuantity = () => {
    if (quantityMultiplier <= 0) return;
    const finalProtein = Math.round(selectedSuggestion!.proteinPerPortion * quantityMultiplier * 10) / 10;
    setProtein(finalProtein);
    setStep('form');
  };

  const handleCancelQuantity = () => {
    setSelectedSuggestion(null);
    setStep('form');
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

    // Suggestion variables & functions
    sugName,
    setSugName,
    sugProtein,
    setSugProtein,
    sugError,
    setSugError,
    editingSuggestion,
    handleSaveSuggestion,
    handleStartEditSuggestion,
    handleCancelEditSuggestion,
    handleDeleteSuggestionClick,

    // Selection & Consumption
    selectedSuggestion,
    setSelectedSuggestion,
    quantityMultiplier,
    setQuantityMultiplier,
    step,
    setStep,
    handleSelectSuggestion,
    handleConfirmQuantity,
    handleCancelQuantity,
  };
};
