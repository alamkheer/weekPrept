import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Image, Link } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Ingredient, Unit, RecipeProperty } from '../types';

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
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileUrl, setImageFileUrl] = useState('');
  const [properties, setProperties] = useState<RecipeProperty[]>([
    { label: 'Serves', value: '' },
    { label: 'Protein', value: '' },
    { label: 'Carbs', value: '' }
  ]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = () => {
    setProperties([...properties, { label: '', value: '' }]);
  };

  const updateProperty = (index: number, field: 'label' | 'value', value: string) => {
    const newProps = [...properties];
    newProps[index] = { ...newProps[index], [field]: value };
    setProperties(newProps);
  };

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(i => i.name.trim() !== '');

    // Image resolution
    const finalImage = imageMode === 'upload' ? imageFileUrl : imageUrl;
    const recipeImage = finalImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

    // Filter properties to keep only non-empty label and value pairs
    const validProperties = properties.filter(p => p.label.trim() !== '' && p.value.trim() !== '');

    addRecipe({
      id: Math.random().toString(36).substring(7),
      name,
      description,
      image: recipeImage,
      prepTime,
      ingredients: validIngredients,
      instructions: ['Prep ingredients.', 'Cook.', 'Serve.'], // Mock instructions
      properties: validProperties
    });
    
    // Reset and close
    setName('');
    setDescription('');
    setImageUrl('');
    setImageFileUrl('');
    setImageMode('url');
    setProperties([
      { label: 'Serves', value: '' },
      { label: 'Protein', value: '' },
      { label: 'Carbs', value: '' }
    ]);
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
            className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[92vh] bg-white rounded-t-3xl shadow-xl z-[60] flex flex-col"
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
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Recipe Image</label>
                <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${imageMode === 'url' ? 'bg-white text-sage-900 shadow-sm' : 'text-gray-500 hover:text-sage-900'}`}
                  >
                    <Link size={14} /> Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${imageMode === 'upload' ? 'bg-white text-sage-900 shadow-sm' : 'text-gray-500 hover:text-sage-900'}`}
                  >
                    <Image size={14} /> Upload Image
                  </button>
                </div>
                {imageMode === 'url' ? (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500 text-sm"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-sage-50/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Image size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-sage-600">Click to upload an image file</span>
                      <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                    </div>
                    {imageFileUrl && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={imageFileUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageFileUrl('')}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
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

              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">
                  Properties & Tags
                  <span className="block text-xs font-normal text-gray-500 mt-1">Add details like servings, nutritional info, or custom labels</span>
                </label>
                
                <div className="space-y-3">
                  {properties.map((prop, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                       <input 
                        type="text"
                        value={prop.label}
                        onChange={(e) => updateProperty(idx, 'label', e.target.value)}
                        placeholder="Property name (e.g. Serves)"
                        className="w-1/3 bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500 text-sm font-semibold"
                       />
                       <input 
                        type="text"
                        value={prop.value}
                        onChange={(e) => updateProperty(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. One)"
                        className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500 text-sm"
                       />
                       <button 
                        onClick={() => removeProperty(idx)}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-red-500"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddProperty}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sage-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-sage-50 transition-colors mt-2"
                  >
                    <Plus size={16} /> Add Custom Property
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
