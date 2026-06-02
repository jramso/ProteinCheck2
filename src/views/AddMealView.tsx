import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Screen, Meal } from '../models/types';
import { ArrowLeft, CheckCircle, Bolt, Trash2, Search, Loader2 } from 'lucide-react';
import { FatSecretFood } from '../services/fatsecretService';
import { QUICK_FOODS } from '../constants/meals';
import { extractProteinFromDescription } from '../utils/mealParsers';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { useAddMealForm } from '../hooks/useAddMealForm';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface AddMealProps {
  user: UserProfile;
  meal?: Meal | null;
  onNavigate: (screen: Screen) => void;
}

export default function AddMealView({ user, meal, onNavigate }: AddMealProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    name, setName,
    protein, setProtein,
    isLoading,
    handleSave,
    handleDelete,
    setQuickFood
  } = useAddMealForm(user, meal, onNavigate);

  const {
    query, results, isSearching, showResults, setShowResults, search, clearSearch
  } = useFoodSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowResults]);

  const selectFood = (food: FatSecretFood) => {
    setName(food.food_name);
    const p = extractProteinFromDescription(food.food_description);
    if (p > 0) setProtein(p);
    setShowResults(false);
    clearSearch();
  };

  return (
    <div className="px-6 pb-12">
      <header className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNavigate('dashboard')}
          className="-ml-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          {meal ? 'Editar Refeição' : 'Adicionar Refeição'}
        </h1>
      </header>

      <div className="space-y-8 max-w-md mx-auto">
        {/* Busca FatSecret */}
        <section className="relative" ref={searchRef}>
          <Input
            label="Buscar na Base FatSecret"
            placeholder="Pesquisar alimento..."
            value={query}
            onChange={(e) => search(e.target.value)}
            icon={<Search size={20} />}
          />
          {isSearching && (
            <div className="absolute right-4 top-[42px] text-indigo-600 animate-spin">
              <Loader2 size={20} />
            </div>
          )}

          {showResults && (results.length > 0 || isSearching) && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-64 overflow-y-auto overflow-x-hidden">
              {isSearching ? (
                <div className="p-8 flex flex-col items-center gap-2">
                  <Loader2 className="text-indigo-600 animate-spin" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Buscando...</span>
                </div>
              ) : (
                results.map((food) => (
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

        {/* Nome da Refeição */}
        <Input
          label="Nome da Refeição"
          placeholder="Ex: Almoço, Pós-treino"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Valor de Proteína */}
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

        {/* Alimentos Rápidos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bolt className="text-indigo-600" size={20} />
            <h2 className="font-black text-slate-900 tracking-tighter">Alimentos Rápidos</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_FOODS.map((food) => (
              <button
                key={food.name}
                onClick={() => setQuickFood(food)}
                className="flex flex-col items-start p-4 bg-white rounded-2xl text-left border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95"
              >
                <div className="text-indigo-600 mb-3">{food.icon}</div>
                <span className="text-sm font-bold text-slate-900 leading-tight">{food.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{food.protein}g prot</span>
              </button>
            ))}
          </div>
        </section>

        {/* Ações */}
        <div className="pt-4 space-y-3">
          <Button 
            fullWidth 
            variant="secondary" 
            size="lg" 
            onClick={() => onNavigate('scan')}
            icon={<Bolt size={20} />}
          >
            Escanear com IA
          </Button>

          <Button
            fullWidth
            size="xl"
            onClick={handleSave}
            loading={isLoading}
            disabled={!name || protein <= 0}
            icon={!isLoading ? <CheckCircle size={20} /> : undefined}
          >
            {meal ? 'Atualizar Refeição' : 'Salvar Refeição'}
          </Button>

          {meal && (
            <div className="space-y-2">
              {!showConfirmDelete ? (
                <Button
                  fullWidth
                  variant="danger"
                  size="lg"
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isLoading}
                  icon={<Trash2 size={20} />}
                >
                  Remover Refeição
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-rose-600 text-white"
                    size="lg"
                    onClick={handleDelete}
                    loading={isLoading}
                  >
                    Confirmar
                  </Button>
                  <Button
                    className="flex-1 bg-slate-100 text-slate-600"
                    size="lg"
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
