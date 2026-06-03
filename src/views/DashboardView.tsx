import React, { useMemo } from 'react';
import { UserProfile, Meal, Screen } from '../models/types';
import { Plus, Sparkles } from 'lucide-react';
import { MealCard } from '../components/common/MealCard';
import { Button } from '../components/common/Button';
import { getTimeBasedSuggestion } from '../utils/suggestionEngine';

interface DashboardProps {
  user: UserProfile;
  meals: Meal[];
  onNavigate: (screen: Screen, meal?: Meal) => void;
}

export default function DashboardView({ user, meals, onNavigate }: DashboardProps) {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysMeals = meals.filter(m => {
    const mealDate = m.timestamp?.toDate ? m.timestamp.toDate() : new Date(m.timestamp);
    return mealDate.setHours(0, 0, 0, 0) === today;
  });

  const totalProtein = todaysMeals.reduce((acc, m) => acc + m.protein, 0);
  const remaining = Math.max(0, user.proteinGoal - totalProtein);
  const progress = Math.min(100, (totalProtein / user.proteinGoal) * 100);

  const suggestion = useMemo(() => getTimeBasedSuggestion(), []);

  return (
    <div className="px-6">
      <section className="mb-12 flex flex-col items-center py-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-slate-100"
              cx="50" cy="50" r="45"
              fill="none" stroke="currentColor" strokeWidth="8"
            />
            <circle
              className="text-indigo-600 transition-all duration-1000 ease-out"
              cx="50" cy="50" r="45"
              fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Ingestão Total</span>
            <div className="text-5xl font-black tracking-tighter text-slate-900">
              {totalProtein}<span className="text-xl font-medium text-slate-400 ml-1">g</span>
            </div>
            <div className="mt-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full">
              Meta: {user.proteinGoal}g
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Restante</span>
          <div className="text-2xl font-black text-slate-900">{remaining}g</div>
          <div className="w-full bg-slate-50 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-100 text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block mb-2">Streak</span>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-black">12</div>
            <div className="text-xs font-medium opacity-80">Dias</div>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Sugestão Baseada em Horário */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-amber-500" size={20} />
          <h2 className="text-xl font-black tracking-tighter text-slate-900">Sugestão para agora</h2>
        </div>
        <button 
          onClick={() => onNavigate('add-meal', { 
            name: suggestion.food.food_name, 
            protein: suggestion.food.protein,
            timestamp: null
          })}
          className="w-full bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-[2rem] text-white text-left shadow-xl shadow-indigo-100 relative overflow-hidden active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block mb-1">
            {suggestion.period}
          </span>
          <h3 className="text-2xl font-black leading-tight mb-2 pr-12">{suggestion.food.food_name}</h3>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">+{suggestion.food.protein}g Proteína</span>
            <span className="text-xs text-indigo-100 font-medium opacity-80">Toque para adicionar</span>
          </div>
        </button>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-black tracking-tighter text-slate-900">Refeições Recentes</h2>
          <button 
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Ver Tudo
          </button>
        </div>
        <div className="space-y-4">
          {todaysMeals.length > 0 ? (
            todaysMeals.slice(0, 3).map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                onClick={() => onNavigate('add-meal', meal)} 
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">Nenhuma refeição hoje.</p>
            </div>
          )}
        </div>
      </section>

      <button 
        onClick={() => onNavigate('add-meal')}
        className="fixed bottom-28 right-6 w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 flex items-center justify-center active:scale-90 transition-transform z-50"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
