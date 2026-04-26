import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { format, addDays, isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { PlanMealSheet } from '../components/PlanMealSheet';

export function PlanView() {
  const { mealPlan, recipes } = useApp();
  const today = new Date();

  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [selectedDateToPlan, setSelectedDateToPlan] = useState<Date | undefined>(undefined);

  // Generate the next 7 days
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const handleAddMeal = (date: Date) => {
    setSelectedDateToPlan(date);
    setIsPlanSheetOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const dayMeals = mealPlan.filter((m) => m.date === format(day, 'yyyy-MM-dd'));

          return (
            <div key={day.toISOString()} className="relative">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 text-center rounded-xl p-2 ${isToday ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-900'}`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider">{format(day, 'EEE')}</div>
                  <div className="text-lg font-serif">{format(day, 'd')}</div>
                </div>
                <div className="flex-1 border-b border-gray-100"></div>
              </div>

              {/* Meals for the day */}
              <div className="pl-16 space-y-3">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal) => {
                    const recipe = recipes.find((r) => r.id === meal.recipeId);
                    return (
                      <div key={meal.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center">
                        {recipe?.image && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-[10px] text-sage-500 font-semibold uppercase tracking-wider">{meal.mealType}</div>
                          <div className="text-sm font-medium text-sage-900">{recipe?.name || 'Unknown Recipe'}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-400 italic py-2">No meals planned.</div>
                )}
                
                <button 
                  onClick={() => handleAddMeal(day)}
                  className="flex items-center gap-2 text-sm text-sage-600 font-medium py-2 hover:text-sage-900 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center">
                    <Plus size={14} strokeWidth={3} />
                  </div>
                  Add meal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <PlanMealSheet 
        isOpen={isPlanSheetOpen} 
        onClose={() => setIsPlanSheetOpen(false)} 
        prefilledDate={selectedDateToPlan}
      />
    </>
  );
}
