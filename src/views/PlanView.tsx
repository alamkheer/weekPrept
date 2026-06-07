import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { format, addDays, isSameDay } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { PlanMealSheet } from '../components/PlanMealSheet';
import { RecipeDetailSheet } from '../components/RecipeDetailSheet';
import { Recipe } from '../types';

export function PlanView() {
  const { mealPlan, recipes, removeMeal } = useApp();
  const today = new Date();

  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [selectedDateToPlan, setSelectedDateToPlan] = useState<Date | undefined>(undefined);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  // Generate the next 7 days
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const handleAddMeal = (date: Date) => {
    setSelectedDateToPlan(date);
    setIsPlanSheetOpen(true);
  };

  const handleMealTap = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) setSelectedRecipeDetail(recipe);
  };

  return (
    <>
      <div className="space-y-6">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const dayMeals = mealPlan
            .filter((m) => m.date === format(day, 'yyyy-MM-dd'))
            .sort((a, b) => {
              const order: Record<string, number> = {
                'Breakfast': 1,
                'Snack': 2,
                'Lunch': 3,
                'Dinner': 4
              };
              return (order[a.mealType] || 99) - (order[b.mealType] || 99);
            });

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
                      <div
                        key={meal.id}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center cursor-pointer active:scale-[0.99] transition-transform group"
                        onClick={() => handleMealTap(meal.recipeId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleMealTap(meal.recipeId)}
                        aria-label={`View details for ${recipe?.name}`}
                      >
                        {recipe?.image && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-sage-500 font-semibold uppercase tracking-wider">{meal.mealType}</div>
                          <div className="text-sm font-medium text-sage-900 truncate">{recipe?.name || 'Unknown Recipe'}</div>
                          {recipe?.properties && recipe.properties.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {recipe.properties.map((prop, idx) => (
                                <span key={idx} className="inline-block px-1.5 py-0.5 text-[9px] font-medium bg-sage-50 text-sage-700 rounded border border-sage-100/80">
                                  {prop.label}: {prop.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Delete */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          aria-label="Remove meal"
                        >
                          <Trash2 size={14} />
                        </button>
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

      <RecipeDetailSheet
        recipe={selectedRecipeDetail}
        onClose={() => setSelectedRecipeDetail(null)}
      />
    </>
  );
}
