import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, RotateCcw } from 'lucide-react';
import { PlanMealSheet } from '../components/PlanMealSheet';
import { AddRecipeSheet } from '../components/AddRecipeSheet';
import { RecipeDetailSheet } from '../components/RecipeDetailSheet';
import { Recipe } from '../types';

export function RecipesView() {
  const { recipes, inventory, resetToMockData } = useApp();

  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [selectedRecipeToPlan, setSelectedRecipeToPlan] = useState<string | undefined>(undefined);
  
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  const handlePlanClick = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    setSelectedRecipeToPlan(recipeId);
    setIsPlanSheetOpen(true);
  };

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipeDetail(recipe);
  };

  // Compute how many ingredients user has for each recipe
  const recipesWithMatch = useMemo(() => {
    return recipes.map((recipe) => {
      let haveCount = 0;
      const totalCount = recipe.ingredients.length;

      recipe.ingredients.forEach((ing) => {
        const invItem = inventory.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
        if (invItem && invItem.quantity >= ing.quantity) {
          haveCount++;
        } else if (invItem && invItem.quantity > 0) {
          haveCount += 0.5;
        }
      });

      return {
        ...recipe,
        haveCount,
        totalCount,
        matchScore: haveCount / totalCount
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [recipes, inventory]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Suggested from your Pantry</p>
          <button 
            onClick={() => setIsAddRecipeOpen(true)}
            className="inline-flex items-center gap-1.5 bg-sage-600 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-sm hover:bg-sage-700 active:scale-95 transition-all"
          >
            <Plus size={14} />
            Add Recipe
          </button>
        </div>

        <div className="space-y-4">
          {recipesWithMatch.length === 0 ? (
            <div className="text-center py-12 px-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <p className="text-gray-500 text-sm font-medium">No recipes found. Create your own or load sample recipes.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsAddRecipeOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-sage-600 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-sage-700 active:scale-95 transition-all"
                >
                  <Plus size={13} />
                  Add Recipe
                </button>
                <button
                  onClick={resetToMockData}
                  className="inline-flex items-center gap-1.5 bg-sage-100 text-sage-900 font-semibold text-xs px-4 py-2.5 rounded-full hover:bg-sage-200 active:scale-95 transition-all"
                >
                  <RotateCcw size={13} />
                  Reload Samples
                </button>
              </div>
            </div>
          ) : (
            recipesWithMatch.map((recipe) => {
              const isPerfectMatch = recipe.matchScore === 1;
              const matchPercent = Math.round((recipe.haveCount / recipe.totalCount) * 100);

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform"
                  onClick={() => handleCardClick(recipe)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCardClick(recipe)}
                  aria-label={`View details for ${recipe.name}`}
                >
                  <div className="h-40 w-full relative">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-sage-900 flex items-center gap-2 shadow-sm">
                      {isPerfectMatch ? (
                        <>
                           <div className="w-2 h-2 bg-sage-500 rounded-full animate-pulse" />
                           Make it now
                        </>
                      ) : (
                        <>
                           <div className="w-2 h-2 bg-orange-400 rounded-full" />
                           {matchPercent}% ingredients
                        </>
                      )}
                    </div>
                    {/* "Tap for details" hint */}
                    <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] text-white font-medium">
                      Tap for details
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-sage-900 mb-1">{recipe.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-sage-600 font-medium">
                        You have {Math.floor(recipe.haveCount)} of {recipe.totalCount} ingredients
                      </div>
                      <button 
                        onClick={(e) => handlePlanClick(e, recipe.id)}
                        className="flex items-center gap-1 bg-sage-100 text-sage-900 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-sage-200 transition-colors"
                      >
                        <Plus size={14} /> Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <PlanMealSheet 
        isOpen={isPlanSheetOpen}
        onClose={() => setIsPlanSheetOpen(false)}
        prefilledRecipeId={selectedRecipeToPlan}
      />
      
      <AddRecipeSheet 
        isOpen={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
      />

      <RecipeDetailSheet
        recipe={selectedRecipeDetail}
        onClose={() => setSelectedRecipeDetail(null)}
      />
    </>
  );
}
