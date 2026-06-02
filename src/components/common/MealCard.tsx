import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Meal } from '../../models/types';

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onClick }) => {
  const mealDate = meal.timestamp?.toDate ? meal.timestamp.toDate() : new Date(meal.timestamp);
  const timeStr = mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <button 
      onClick={onClick}
      className="w-full group bg-white hover:bg-slate-50 transition-all p-4 rounded-3xl flex items-center gap-4 border border-slate-100 shadow-sm text-left"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img 
          className="w-full h-full object-cover" 
          src={meal.imageUrl || `https://picsum.photos/seed/${meal.name}/200/200`} 
          alt={meal.name}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900">{meal.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{timeStr}</p>
          </div>
          <span className="text-sm font-black text-indigo-600">+{meal.protein}g</span>
        </div>
      </div>
      <ChevronRight className="text-slate-200" size={20} />
    </button>
  );
};
