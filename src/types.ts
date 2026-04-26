export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'item' | 'bunch' | 'clove' | 'can';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  ingredients: Ingredient[];
  instructions: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: string;
}

export interface MealSlot {
  id: string;
  date: string; // YYYY-MM-DD
  recipeId: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface ShoppingListItem {
  name: string;
  quantityNeeded: number;
  quantityInStock: number;
  quantityToBuy: number;
  unit: Unit;
  isChecked: boolean;
}
