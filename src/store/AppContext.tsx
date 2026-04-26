import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { InventoryItem, Recipe, MealSlot, ShoppingListItem } from '../types';
import { initialInventory, initialRecipes, initialMealPlan } from '../data/mock';

interface AppContextType {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  mealPlan: MealSlot[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealSlot[]>>;
  shoppingList: ShoppingListItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryQuantity: (id: string, delta: number) => void;
  addRecipe: (recipe: Recipe) => void;
  scheduleMeal: (slot: MealSlot) => void;
  removeMeal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [mealPlan, setMealPlan] = useState<MealSlot[]>(initialMealPlan);

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

  const updateInventoryQuantity = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prev) => [...prev, recipe]);
  };

  const scheduleMeal = (slot: MealSlot) => {
    setMealPlan((prev) => [...prev, slot]);
  };

  const removeMeal = (id: string) => {
    setMealPlan((prev) => prev.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        inventory,
        setInventory,
        recipes,
        setRecipes,
        mealPlan,
        setMealPlan,
        shoppingList,
        addInventoryItem,
        updateInventoryQuantity,
        addRecipe,
        scheduleMeal,
        removeMeal
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
