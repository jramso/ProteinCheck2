import React from 'react';
import { UserProfile, Meal, Screen } from '../types';
import { Calendar, History as HistoryIcon, Award } from 'lucide-react';

interface HistoryProps {
  user: UserProfile;
  meals: Meal[];
  onNavigate: (screen: Screen) => void;
}

export default function History({ user, meals, onNavigate }: HistoryProps) {
  const dailyAverages = meals.length > 0 ? Math.round(meals.reduce((acc, m) => acc + m.protein, 0) / 7) : 0;

  // Group meals by day
  const groupedMeals = meals.reduce((acc: any, meal) => {
    const date = meal.timestamp?.toDate ? meal.timestamp.toDate() : new Date(meal.timestamp);
    const dateString = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[dateString]) acc[dateString] = { meals: [], total: 0 };
    acc[dateString].meals.push(meal);
    acc[dateString].total += meal.protein;
    return acc;
  }, {});

  return (
    <div className="px-6 pb-12">
      <header className="flex justify-between items-end mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 block mb-1">Visão Semanal</span>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900">Histórico</h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600 block">{dailyAverages}g</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Média Diária</span>
        </div>
      </header>

      {/* Weekly Chart Placeholder */}
      <div className="bg-white rounded-3xl p-8 mb-10 border border-slate-100 shadow-sm">
        <div className="flex items-end justify-between h-40 gap-3">
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-3">
              <div 
                className={`w-full rounded-t-full transition-all duration-1000 ${i === 2 ? 'bg-indigo-600' : 'bg-indigo-50'}`} 
                style={{ height: `${[60, 80, 100, 70, 90, 40, 75][i]}%` }}
              ></div>
              <span className="text-[10px] font-bold text-slate-400">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Logs */}
      <div className="space-y-6">
        {Object.entries(groupedMeals).map(([date, data]: any) => (
          <div key={date} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{date}</h3>
            <div className="bg-white rounded-3xl p-5 flex items-center justify-between border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{data.meals.length} refeições</p>
                  <p className="text-xs text-slate-400 font-medium">Total do dia</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-indigo-600">{data.total}g</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${data.total >= user.proteinGoal ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {data.total >= user.proteinGoal ? 'Meta Batida' : 'Abaixo da Meta'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badge Section */}
      <section className="mt-12">
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white aspect-[16/10] flex flex-col justify-end shadow-xl shadow-slate-200">
          <img 
            alt="Streak" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
            src="https://picsum.photos/seed/fitness/800/500"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-indigo-400" size={20} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-300">Selo de Consistência</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter">7 Dias de Foco</h3>
            <p className="text-slate-300 text-sm mt-2 max-w-[220px] leading-relaxed">
              Você manteve sua meta de proteína em 10% durante toda a semana.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
