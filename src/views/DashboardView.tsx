import React from 'react';
import { UserProfile, Meal, Screen } from '../models/types';
import { Plus } from 'lucide-react';
import { MealCard } from '../components/common/MealCard';
import { Button } from '../components/common/Button';

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
