import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { addDays, format, isSameDay } from 'date-fns';

interface PlanMealSheetProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDate?: Date;
  prefilledRecipeId?: string;
}

export function PlanMealSheet({ isOpen, onClose, prefilledDate, prefilledRecipeId }: PlanMealSheetProps) {
  const { recipes, scheduleMeal } = useApp();
  
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(prefilledDate || weekDays[0]);
  const [selectedRecipe, setSelectedRecipe] = useState<string | undefined>(prefilledRecipeId);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Dinner');

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        const sheets = document.querySelectorAll('.rounded-t-3xl');
        if (sheets.length <= 1) {
          document.body.style.overflow = '';
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  const handleSave = () => {
    if (selectedDate && selectedRecipe) {
      scheduleMeal({
        id: Math.random().toString(36).substring(7),
        date: format(selectedDate, 'yyyy-MM-dd'),
        recipeId: selectedRecipe,
        mealType: mealType,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[92vh] bg-white rounded-t-3xl shadow-xl z-[70] flex flex-col"
          >
            {/* Header — never scrolls */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h2 className="font-serif text-2xl text-sage-900 font-semibold tracking-tight">Plan a Meal</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Selection */}
              {!prefilledDate && (
                <div>
                  <label className="text-sm font-semibold text-sage-900 mb-2 block">Choose a Day</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
                    {weekDays.map(day => {
                      const isSelected = selectedDate && isSameDay(selectedDate, day);
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`snap-start flex-shrink-0 w-16 p-2 rounded-2xl flex flex-col items-center justify-center border-2 transition-colors ${isSelected ? 'border-sage-600 bg-sage-50 text-sage-900' : 'border-transparent bg-gray-50 text-gray-500'}`}
                        >
                          <span className="text-[10px] uppercase font-bold">{format(day, 'EEE')}</span>
                          <span className="text-lg font-serif">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recipe Selection */}
              {!prefilledRecipeId && (
                <div>
                  <label className="text-sm font-semibold text-sage-900 mb-2 block">Select Recipe</label>
                  <div className="grid grid-cols-2 gap-3">
                    {recipes.map(recipe => (
                      <button
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe.id)}
                        className={`p-2 rounded-2xl border-2 text-left transition-colors flex flex-col gap-2 ${selectedRecipe === recipe.id ? 'border-sage-600 bg-sage-50' : 'border-gray-100 bg-white'}`}
                      >
                        <div className="w-full h-20 rounded-xl overflow-hidden">
                          <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.name} />
                        </div>
                        <span className="text-xs font-medium text-sage-900 line-clamp-2">{recipe.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Type */}
              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Meal Type</label>
                <div className="flex gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${mealType === type ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky footer CTA — always visible */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
              <button
                onClick={handleSave}
                disabled={!selectedDate || !selectedRecipe}
                className="w-full bg-sage-900 text-white font-medium py-3.5 rounded-2xl disabled:opacity-50 transition-opacity"
              >
                Add to Calendar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
