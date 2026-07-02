import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Screen, Meal } from '../models/types';
import { ArrowLeft, CheckCircle, Bolt, Trash2, Search, Loader2, Edit3 } from 'lucide-react';
import { FatSecretFood } from '../services/fatsecretService';
import { QUICK_FOODS } from '../constants/meals';
import { extractProteinFromDescription } from '../utils/mealParsers';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { useAddMealForm } from '../hooks/useAddMealForm';
import { useMeals } from '../hooks/useMeals';
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
    setQuickFood,

    // Suggestion variables & functions
    sugName, setSugName,
    sugProtein, setSugProtein,
    sugError,
    editingSuggestion,
    handleSaveSuggestion,
    handleStartEditSuggestion,
    handleCancelEditSuggestion,
    handleDeleteSuggestionClick,

    // Selection & Consumption
    selectedSuggestion,
    quantityMultiplier, setQuantityMultiplier,
    step,
    handleSelectSuggestion,
    handleConfirmQuantity,
    handleCancelQuantity,
  } = useAddMealForm(user, meal, onNavigate);

  const { suggestions } = useMeals(user.uid);

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

  // Quantity Selection Step UI
  if (step === 'quantity' && selectedSuggestion) {
    return (
      <div className="px-6 pb-12">
        <header className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancelQuantity}
            className="-ml-2"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            Definir Quantidade
          </h1>
        </header>

        <div className="space-y-8 max-w-md mx-auto text-center py-8">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {selectedSuggestion.name}
            </span>
            <p className="text-slate-500 text-xs font-semibold mt-2">
              Proteína base: {selectedSuggestion.proteinPerPortion}g por porção
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Multiplicador de Porção
            </label>
            
            <div className="bg-white border border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full"></div>
              
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={quantityMultiplier}
                onChange={(e) => setQuantityMultiplier(Number(e.target.value))}
                className="w-full bg-transparent border-none p-0 text-center text-7xl font-black tracking-tighter text-slate-900 focus:ring-0"
              />
              
              <div className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                multiplicar porção original
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              {[0.5, 1.0, 1.5, 2.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuantityMultiplier(val)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    quantityMultiplier === val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                      : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10'
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Proteína Final Calculada</span>
            <span className="text-3xl font-black tracking-tighter text-slate-900">
              {Math.round(selectedSuggestion.proteinPerPortion * quantityMultiplier * 10) / 10}g
            </span>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              className="flex-1"
              variant="outline"
              size="lg"
              onClick={handleCancelQuantity}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleConfirmQuantity}
              disabled={quantityMultiplier <= 0}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Form UI
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

        {/* Minhas Sugestões de Consumo */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bolt className="text-indigo-600" size={20} />
              <h2 className="font-black text-slate-900 tracking-tighter">Minhas Sugestões</h2>
            </div>
            {user.uid.startsWith('guest-') ? (
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">Modo Visitante</span>
            ) : null}
          </div>

          {user.uid.startsWith('guest-') ? (
            <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl text-center space-y-3">
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Você está no modo visitante. Cadastre uma conta para salvar seus alimentos frequentes e agilizar seu registro diário!
              </p>
              <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-50 text-amber-800" onClick={() => onNavigate('profile')}>
                Criar Conta
              </Button>
            </div>
          ) : (
            <>
              {/* Formulário de adicionar/editar sugestão */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-700">
                  {editingSuggestion ? 'Editar Sugestão' : 'Nova Sugestão'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nome (ex: Whey, Ovo)"
                    value={sugName}
                    onChange={(e) => setSugName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Proteína (g)"
                    value={sugProtein || ''}
                    onChange={(e) => setSugProtein(Number(e.target.value))}
                  />
                </div>
                {sugError && (
                  <p className="text-[10px] text-rose-600 font-bold ml-1 flex items-center gap-1">
                    <span>⚠</span> {sugError}
                  </p>
                )}
                <div className="flex gap-2 justify-end">
                  {editingSuggestion && (
                    <Button variant="ghost" size="sm" onClick={handleCancelEditSuggestion} disabled={isLoading}>
                      Cancelar
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSaveSuggestion} loading={isLoading}>
                    {editingSuggestion ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </div>

              {/* Lista de sugestões */}
              {suggestions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                  <p className="text-xs font-semibold">Nenhuma sugestão cadastrada ainda.</p>
                  <p className="text-[10px] mt-1 text-slate-400">Cadastre seus alimentos frequentes acima!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all"
                    >
                      <button
                        onClick={() => handleSelectSuggestion(sug)}
                        className="flex-1 text-left flex flex-col"
                      >
                        <span className="text-sm font-bold text-slate-900 leading-tight">{sug.name}</span>
                        <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mt-0.5">
                          {sug.proteinPerPortion}g porção
                        </span>
                      </button>
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => handleStartEditSuggestion(sug)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => sug.id && handleDeleteSuggestionClick(sug.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
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
