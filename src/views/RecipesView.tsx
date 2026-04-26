import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus } from 'lucide-react';
import { PlanMealSheet } from '../components/PlanMealSheet';
import { AddRecipeSheet } from '../components/AddRecipeSheet';

export function RecipesView() {
  const { recipes, inventory } = useApp();

  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [selectedRecipeToPlan, setSelectedRecipeToPlan] = useState<string | undefined>(undefined);
  
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  const handlePlanClick = (recipeId: string) => {
    setSelectedRecipeToPlan(recipeId);
    setIsPlanSheetOpen(true);
  };

  // Compute how many ingredients user has for each recipe
  const recipesWithMatch = useMemo(() => {
    return recipes.map((recipe) => {
      let haveCount = 0;
      const totalCount = recipe.ingredients.length;

      recipe.ingredients.forEach((ing) => {
        const invItem = inventory.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
        // Simple logic: if they have ANY of it, count it as a match for display purposes,
        // or check if qty >= required qty. Let's do qty >= required qty for true match.
        if (invItem && invItem.quantity >= ing.quantity) {
          haveCount++;
        } else if (invItem && invItem.quantity > 0) {
          // Partial match - count as 0.5 for sorting?
          haveCount += 0.5;
        }
      });

      return {
        ...recipe,
        haveCount,
        totalCount,
        matchScore: haveCount / totalCount
      };
    }).sort((a, b) => b.matchScore - a.matchScore); // Sort by highest match
  }, [recipes, inventory]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Suggested from your Pantry</p>
          <button 
            onClick={() => setIsAddRecipeOpen(true)}
            className="text-sage-600 font-medium text-sm"
          >
            Add Recipe
          </button>
        </div>

        <div className="space-y-4">
          {recipesWithMatch.map((recipe) => {
            const isPerfectMatch = recipe.matchScore === 1;
            const matchPercent = Math.round((recipe.haveCount / recipe.totalCount) * 100);

            return (
              <div key={recipe.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
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
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-semibold text-sage-900 mb-1">{recipe.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-sage-600 font-medium">
                      You have {Math.floor(recipe.haveCount)} of {recipe.totalCount} ingredients
                    </div>
                    <button 
                      onClick={() => handlePlanClick(recipe.id)}
                      className="flex items-center gap-1 bg-sage-100 text-sage-900 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-sage-200 transition-colors"
                    >
                      <Plus size={14} /> Plan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    </>
  );
}
