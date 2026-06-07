import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { InventoryItem, Recipe, MealSlot, ShoppingListItem } from '../types';
import { initialInventory, initialRecipes, initialMealPlan } from '../data/mock';
import { getRecipes, saveRecipe, deleteRecipeFromDB, saveRecipes, getMealPlan, saveMealSlot, deleteMealSlot, saveMealPlan, clearMealPlanForRecipe } from '../lib/db';

interface AppContextType {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  mealPlan: MealSlot[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealSlot[]>>;
  shoppingList: ShoppingListItem[];
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (id: string) => void;
  updateInventoryQuantity: (id: string, delta: number) => void;
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  scheduleMeal: (slot: MealSlot) => void;
  removeMeal: (id: string) => void;
  resetToMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [mealPlan, setMealPlan] = useState<MealSlot[]>(initialMealPlan);

  useEffect(() => {
    const isInitialized = localStorage.getItem('weekprept_initialized') === 'true';

    async function initializeAndLoad() {
      try {
        if (!isInitialized) {
          await saveRecipes(initialRecipes);
          await saveMealPlan(initialMealPlan);
          localStorage.setItem('weekprept_initialized', 'true');
          setRecipes(initialRecipes);
          setMealPlan(initialMealPlan);
        } else {
          const storedRecipes = await getRecipes();
          setRecipes(storedRecipes);
          const storedMealPlan = await getMealPlan();
          setMealPlan(storedMealPlan);
        }
      } catch (error) {
        console.error('Failed to initialize or load data from IndexedDB:', error);
      }
    }

    initializeAndLoad();
  }, []);

  // Behavior 3: Automated Delta Shopping List
  const shoppingList = useMemo(() => {
    // 1. Calculate required ingredients based on meal plan
    const requiredIngredients: Record<string, { quantity: number; unit: string; name: string }> = {};

    mealPlan.forEach((meal) => {
      const recipe = recipes.find((r) => r.id === meal.recipeId);
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase();
          if (!requiredIngredients[key]) {
            requiredIngredients[key] = { quantity: 0, unit: ing.unit, name: ing.name };
          }
          requiredIngredients[key].quantity += ing.quantity;
        });
      }
    });

    // 2. Cross-reference with inventory to find the delta
    const list: ShoppingListItem[] = [];
    
    Object.keys(requiredIngredients).forEach((key) => {
      const req = requiredIngredients[key];
      const invItem = inventory.find((i) => i.name.toLowerCase() === key);
      const quantityInStock = invItem ? invItem.quantity : 0;
      
      const quantityToBuy = Math.max(0, req.quantity - quantityInStock);

      if (quantityToBuy > 0) {
        list.push({
          name: req.name,
          quantityNeeded: req.quantity,
          quantityInStock: quantityInStock,
          quantityToBuy: quantityToBuy,
          unit: req.unit as any,
          isChecked: false,
        });
      }
    });

    return list;
  }, [mealPlan, recipes, inventory]);

  const addInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => [...prev, item]);
  };

  const removeInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateInventoryQuantity = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe]);
    saveRecipe(recipe).catch((err) => console.error('Failed to save recipe to IndexedDB:', err));
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    deleteRecipeFromDB(id).catch((err) => console.error('Failed to delete recipe from IndexedDB:', err));
    setMealPlan((prev) => prev.filter((m) => m.recipeId !== id));
    clearMealPlanForRecipe(id).catch((err) => console.error('Failed to clear associated meals from IndexedDB:', err));
  };

  const scheduleMeal = (slot: MealSlot) => {
    setMealPlan((prev) => [...prev, slot]);
    saveMealSlot(slot).catch((err) => console.error('Failed to save meal slot to IndexedDB:', err));
  };

  const removeMeal = (id: string) => {
    setMealPlan((prev) => prev.filter(m => m.id !== id));
    deleteMealSlot(id).catch((err) => console.error('Failed to delete meal slot from IndexedDB:', err));
  };

  const resetToMockData = () => {
    saveRecipes(initialRecipes).catch((err) => console.error('Failed to save initial recipes to IndexedDB:', err));
    saveMealPlan(initialMealPlan).catch((err) => console.error('Failed to save initial meal plan to IndexedDB:', err));
    localStorage.setItem('weekprept_initialized', 'true');
    setRecipes(initialRecipes);
    setMealPlan(initialMealPlan);
  };

  return (
    <AppContext.Provider
      value={{
        inventory,
        setInventory,
        removeInventoryItem,
        recipes,
        setRecipes,
        mealPlan,
        setMealPlan,
        shoppingList,
        addInventoryItem,
        updateInventoryQuantity,
        addRecipe,
        deleteRecipe,
        scheduleMeal,
        removeMeal,
        resetToMockData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
