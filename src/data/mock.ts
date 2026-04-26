import { InventoryItem, Recipe, MealSlot } from '../types';
import { format, addDays } from 'date-fns';

const today = new Date();

export const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Eggs', quantity: 4, unit: 'item', category: 'Dairy' },
  { id: '2', name: 'Rice', quantity: 500, unit: 'g', category: 'Pantry' },
  { id: '3', name: 'Black Beans', quantity: 2, unit: 'can', category: 'Pantry' },
  { id: '4', name: 'Chicken Breast', quantity: 2, unit: 'item', category: 'Meat' },
  { id: '5', name: 'Olive Oil', quantity: 400, unit: 'ml', category: 'Pantry' },
  { id: '6', name: 'Garlic', quantity: 1, unit: 'item', category: 'Produce' },
  { id: '7', name: 'Onion', quantity: 0, unit: 'item', category: 'Produce' },
];

export const initialRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Simple Chicken Fried Rice',
    description: 'A quick and easy chicken fried rice using pantry staples.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    prepTime: 20,
    ingredients: [
      { id: 'i1', name: 'Rice', quantity: 200, unit: 'g' },
      { id: 'i2', name: 'Chicken Breast', quantity: 1, unit: 'item' },
      { id: 'i3', name: 'Eggs', quantity: 2, unit: 'item' },
      { id: 'i4', name: 'Onion', quantity: 1, unit: 'item' },
      { id: 'i5', name: 'Olive Oil', quantity: 15, unit: 'ml' },
    ],
    instructions: [
      'Cook rice if not already cooked.',
      'Dice chicken and onion.',
      'Sauté chicken in olive oil until cooked.',
      'Push chicken aside, scramble eggs.',
      'Mix everything with rice.'
    ]
  },
  {
    id: 'r2',
    name: 'Black Bean Bowl',
    description: 'Healthy and filling vegetarian black bean and rice bowl.',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4142f36bc?auto=format&fit=crop&q=80&w=800',
    prepTime: 15,
    ingredients: [
      { id: 'i6', name: 'Rice', quantity: 150, unit: 'g' },
      { id: 'i7', name: 'Black Beans', quantity: 1, unit: 'can' },
      { id: 'i8', name: 'Garlic', quantity: 2, unit: 'clove' },
      { id: 'i9', name: 'Olive Oil', quantity: 15, unit: 'ml' },
    ],
    instructions: [
      'Cook rice.',
      'Heat olive oil, mince and cook garlic.',
      'Add beans to pan and heat through.',
      'Serve beans over rice.'
    ]
  },
  {
    id: 'r3',
    name: 'Garlic Butter Chicken',
    description: 'Tender chicken breasts cooked in a rich garlic butter sauce.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
    prepTime: 25,
    ingredients: [
        { id: 'i10', name: 'Chicken Breast', quantity: 2, unit: 'item' },
        { id: 'i11', name: 'Garlic', quantity: 4, unit: 'clove' },
        { id: 'i12', name: 'Olive Oil', quantity: 30, unit: 'ml' },
    ],
    instructions: [
        'Season chicken.',
        'Cook in hot pan until golden brown.',
        'Add minced garlic in the last 2 minutes.',
        'Serve hot.'
    ]
  }
];

export const initialMealPlan: MealSlot[] = [
  {
    id: 'm1',
    date: format(today, 'yyyy-MM-dd'),
    recipeId: 'r1',
    mealType: 'Dinner',
  },
  {
    id: 'm2',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    recipeId: 'r2',
    mealType: 'Lunch',
  }
];
