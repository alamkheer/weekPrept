import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Recipe } from '../types';
import { PlanMealSheet } from './PlanMealSheet';

interface RecipeDetailSheetProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export function RecipeDetailSheet({ recipe, onClose }: RecipeDetailSheetProps) {
  const { inventory, deleteRecipe } = useApp();
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const handleDelete = () => {
    if (!recipe) return;
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"? This will also remove it from any planned meals.`)) {
      deleteRecipe(recipe.id);
      onClose();
    }
  };

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (recipe) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [recipe, handleKeyDown]);

  if (!recipe) return null;

  const ingredientsWithStatus = recipe.ingredients.map((ing) => {
    const invItem = inventory.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
    const inStock = invItem && invItem.quantity >= ing.quantity;
    const partial = invItem && invItem.quantity > 0 && !inStock;
    return { ...ing, inStock: !!inStock, partial: !!partial };
  });

  const haveCount = ingredientsWithStatus.filter(i => i.inStock).length;
  const total = ingredientsWithStatus.length;
  const readyToCook = haveCount === total;

  return (
    <>
      <AnimatePresence>
        {recipe && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] flex flex-col"
              style={{ maxHeight: '92vh' }}
            >
              {/* Hero image — compact */}
              <div className="relative h-40 flex-shrink-0 overflow-hidden rounded-t-3xl">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Delete button */}
                <button
                  onClick={handleDelete}
                  className="absolute top-3 right-[48px] w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors animate-fade-in"
                  aria-label="Delete Recipe"
                >
                  <Trash2 size={16} />
                </button>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                {/* Pantry match badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm ${readyToCook ? 'bg-sage-500/90 text-white' : 'bg-white/90 text-sage-900'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${readyToCook ? 'bg-white animate-pulse' : 'bg-orange-400'}`} />
                    {readyToCook ? 'Ready to cook!' : `${haveCount} of ${total} in pantry`}
                  </span>
                </div>

                {/* Title overlay on image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="font-serif text-xl font-semibold text-white leading-tight drop-shadow">{recipe.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5 text-white/80 text-[11px]">
                    <Clock size={11} />
                    <span>{recipe.prepTime} min prep</span>
                  </div>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                {/* Description */}
                {recipe.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{recipe.description}</p>
                )}

                {/* Properties & Tags */}
                {recipe.properties && recipe.properties.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {recipe.properties.map((prop, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-sage-50 text-sage-800 border border-sage-100">
                        <span className="font-semibold mr-1">{prop.label}:</span>
                        <span>{prop.value}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Ingredients */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-3">Ingredients</h3>
                  <div className="space-y-2">
                    {ingredientsWithStatus.map((ing) => (
                      <div
                        key={ing.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${ing.inStock ? 'bg-sage-50 border border-sage-100' : ing.partial ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        {ing.inStock ? (
                          <CheckCircle2 size={16} className="text-sage-500 flex-shrink-0" />
                        ) : (
                          <Circle size={16} className={`flex-shrink-0 ${ing.partial ? 'text-amber-400' : 'text-gray-300'}`} />
                        )}
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${ing.inStock ? 'text-sage-900' : 'text-gray-700'}`}>
                            {ing.name}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold ${ing.inStock ? 'text-sage-600' : ing.partial ? 'text-amber-600' : 'text-gray-400'}`}>
                          {ing.quantity} {ing.unit !== 'item' ? ing.unit : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-sage-500" /> In pantry</span>
                    <span className="flex items-center gap-1"><Circle size={12} className="text-amber-400" /> Partial</span>
                    <span className="flex items-center gap-1"><Circle size={12} className="text-gray-300" /> Need to buy</span>
                  </div>
                </div>

                {/* Instructions */}
                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-3">Instructions</h3>
                    <ol className="space-y-3">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-sage-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Sticky CTA — always visible at bottom of sheet */}
              <div className="flex-shrink-0 px-5 pt-4 pb-6 border-t border-gray-100 bg-white" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 24px)' }}>
                <button
                  onClick={() => setIsPlanOpen(true)}
                  className="w-full bg-sage-900 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-sage-800 active:scale-[0.98] transition-all shadow-lg shadow-sage-900/20"
                >
                  <Plus size={18} />
                  Plan This Meal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nested plan sheet */}
      <PlanMealSheet
        isOpen={isPlanOpen}
        onClose={() => {
          setIsPlanOpen(false);
          onClose();
        }}
        prefilledRecipeId={recipe?.id}
      />
    </>
  );
}
