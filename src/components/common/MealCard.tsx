import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Meal } from '../../models/types';
import { getLocalFallbackUrl } from '../../utils/imageFallbacks';

interface MealCardProps {
  meal: Meal;
  onClick: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onClick }) => {
  let mealDate: Date;
  if (meal.timestamp) {
    if (typeof meal.timestamp === 'object' && 'toDate' in meal.timestamp && typeof meal.timestamp.toDate === 'function') {
      mealDate = meal.timestamp.toDate();
    } else {
      const parsedDate = new Date(meal.timestamp as any);
      mealDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
  } else {
    mealDate = new Date();
  }
  const timeStr = mealDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <button 
      onClick={onClick}
      className="w-full group bg-white hover:bg-slate-50 transition-all p-4 rounded-3xl flex items-center gap-4 border border-slate-100 shadow-sm text-left"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img 
          className="w-full h-full object-cover" 
          src={meal.imageUrl || getLocalFallbackUrl(meal.name)} 
          alt={meal.name}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              {meal.name}
              {meal.suggestionId && (
                <span className="text-[8px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Sugestão
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{timeStr}</p>
          </div>
          <span className="text-sm font-black text-indigo-600">+{meal.protein}g</span>
        </div>
      </div>
      <ChevronRight className="text-slate-200" size={20} />
    </button>
  );
};
