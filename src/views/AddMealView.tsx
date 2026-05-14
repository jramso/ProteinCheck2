import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Screen, Meal } from '../models/types';
import { ArrowLeft, CheckCircle, Bolt, Utensils, Egg, Dumbbell, Apple, Trash2, Search, Loader2 } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from '../services/firebaseService';
import { fatSecretService, FatSecretFood } from '../services/fatsecretService';

interface AddMealProps {
  user: UserProfile;
  meal?: Meal | null;
  onNavigate: (screen: Screen) => void;
}

const QUICK_FOODS = [
  { name: 'Whey Protein', protein: 25, icon: <Dumbbell size={20} /> },
  { name: 'Ovo (Unidade)', protein: 6, icon: <Egg size={20} /> },
  { name: 'Peito de Frango', protein: 31, icon: <Utensils size={20} /> },
  { name: 'Iogurte Grego', protein: 10, icon: <Apple size={20} /> },
];

export default function AddMealView({ user, meal, onNavigate }: AddMealProps) {
  const [name, setName] = useState(meal?.name || '');
  const [protein, setProtein] = useState<number>(meal?.protein || 0);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FatSecretFood[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);
    const results = await fatSecretService.search(query);
    setSearchResults(results);
    setSearching(false);
  };

  const selectFood = (food: FatSecretFood) => {
    setName(food.food_name);
    const proteinMatch = food.food_description.match(/Protein: ([\d.]+)g/);
    if (proteinMatch) {
      setProtein(Math.round(parseFloat(proteinMatch[1])));
    }
    setShowResults(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (meal) {
      setName(meal.name);
      setProtein(meal.protein);
    }
  }, [meal]);

  const handleSave = async () => {
    if (!name || protein <= 0) return;
    setLoading(true);
    try {
      if (meal?.id) {
        await updateDoc(doc(db, 'users', user.uid, 'meals', meal.id), {
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
      onNavigate('dashboard');
    } catch (error) {
      console.error("Error saving meal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!meal?.id) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'meals', meal.id));
      onNavigate('dashboard');
    } catch (error) {
      console.error("Error deleting meal:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuickFood = (food: typeof QUICK_FOODS[0]) => {
    setName(food.name);
    setProtein(food.protein);
  };

  return (
    <div className="px-6 pb-12">
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2 -ml-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          {meal ? 'Editar Refeição' : 'Adicionar Refeição'}
        </h1>
      </header>

      <div className="space-y-8 max-w-md mx-auto">
        <section className="space-y-2 relative" ref={searchRef}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Buscar na Base FatSecret</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Pesquisar alimento..."
              className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-bold"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin" size={20} />}
          </div>

          {showResults && (searchResults.length > 0 || searching) && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-64 overflow-y-auto overflow-x-hidden">
              {searching ? (
                <div className="p-8 flex flex-col items-center gap-2">
                  <Loader2 className="text-indigo-600 animate-spin" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Buscando...</span>
                </div>
              ) : (
                searchResults.map((food) => (
                  <button
                    key={food.food_id}
                    onClick={() => selectFood(food)}
                    className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors"
                  >
                    <p className="font-bold text-slate-900">{food.food_name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{food.food_description}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        <section className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nome da Refeição</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Almoço, Pós-treino"
            className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-bold"
          />
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Proteína (g)</label>
            <span className="text-indigo-600 font-black text-sm">Meta: {user.proteinGoal}g</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full"></div>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              className="w-full bg-transparent border-none p-0 text-center text-7xl font-black tracking-tighter text-slate-900 focus:ring-0"
            />
            <div className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">gramas de proteína</div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bolt className="text-indigo-600" size={20} />
            <h2 className="font-black text-slate-900 tracking-tighter">Alimentos Rápidos</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_FOODS.map((food) => (
              <button
                key={food.name}
                onClick={() => addQuickFood(food)}
                className="flex flex-col items-start p-4 bg-white rounded-2xl text-left border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95"
              >
                <div className="text-indigo-600 mb-3">{food.icon}</div>
                <span className="text-sm font-bold text-slate-900 leading-tight">{food.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{food.protein}g prot</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <button 
            onClick={() => onNavigate('scan')}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Bolt size={20} />
            Escanear com IA
          </button>
        </section>

        <section className="pt-2 space-y-3">
          <button
            onClick={handleSave}
            disabled={loading || !name || protein <= 0}
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? 'Salvando...' : (
              <>
                <span>{meal ? 'Atualizar Refeição' : 'Salvar Refeição'}</span>
                <CheckCircle size={20} />
              </>
            )}
          </button>

          {meal && (
            <div className="space-y-2">
              {!showConfirmDelete ? (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={loading}
                  className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Trash2 size={20} />
                  Remover Refeição
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    Confirmar Exclusão
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={loading}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
