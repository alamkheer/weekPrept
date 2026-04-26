import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Ingredient, Unit } from '../types';

interface AddRecipeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'item', 'bunch', 'clove', 'can'];

export function AddRecipeSheet({ isOpen, onClose }: AddRecipeSheetProps) {
  const { addRecipe } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState(15);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 't1', name: '', quantity: 1, unit: 'item' }
  ]);

  const handleAddIngredientRow = () => {
    setIngredients([...ingredients, { id: Math.random().toString(36).substring(7), name: '', quantity: 1, unit: 'item' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(i => i.name.trim() !== '');

    addRecipe({
      id: Math.random().toString(36).substring(7),
      name,
      description,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800', // Mock image
      prepTime,
      ingredients: validIngredients,
      instructions: ['Prep ingredients.', 'Cook.', 'Serve.'] // Mock instructions
    });
    
    // Reset and close
    setName('');
    setDescription('');
    setIngredients([{ id: 't1', name: '', quantity: 1, unit: 'item' }]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 transition-opacity"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[92vh] bg-white rounded-t-3xl shadow-xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h2 className="font-serif text-2xl text-sage-900 font-semibold tracking-tight">New Recipe</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-safe">
              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Recipe Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pasta Primavera"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description..."
                  rows={2}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">
                  Ingredients
                  <span className="block text-xs font-normal text-gray-500 mt-1">Structured input enables automated shopping lists</span>
                </label>
                
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div key={ing.id} className="flex items-center gap-2">
                       <input 
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={ing.quantity || ''}
                        onChange={(e) => updateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-20 bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500 text-center"
                        placeholder="Qty"
                       />
                       <select 
                        value={ing.unit}
                        onChange={(e) => updateIngredient(idx, 'unit', e.target.value as Unit)}
                        className="w-24 bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                       >
                         {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                       </select>
                       <input 
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                       />
                       <button 
                        onClick={() => removeIngredient(idx)}
                        disabled={ingredients.length === 1}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddIngredientRow}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sage-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-sage-50 transition-colors mt-2"
                  >
                    <Plus size={16} /> Add Ingredient
                  </button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 flex-shrink-0 pb-safe">
              <button
                onClick={handleSave}
                disabled={!name.trim() || ingredients[0].name.trim() === ''}
                className="w-full bg-sage-900 text-white font-medium py-3.5 rounded-2xl disabled:opacity-50"
              >
                Save Recipe
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
