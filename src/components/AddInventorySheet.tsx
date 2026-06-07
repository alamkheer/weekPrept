import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Unit } from '../types';

interface AddInventorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'item', 'bunch', 'clove', 'can'];
const CATEGORIES = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Spices', 'Other'];

export function AddInventorySheet({ isOpen, onClose }: AddInventorySheetProps) {
  const { addInventoryItem } = useApp();
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('item');
  const [category, setCategory] = useState(CATEGORIES[0]);

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
    if (!name.trim()) return;

    addInventoryItem({
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      quantity,
      unit,
      category
    });
    
    setName('');
    setQuantity(1);
    setUnit('item');
    setCategory(CATEGORIES[0]);
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
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[92vh] bg-white rounded-t-3xl shadow-xl z-[60] flex flex-col"
          >
            {/* Header — never scrolls */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h2 className="font-serif text-2xl text-sage-900 font-semibold tracking-tight">Add to Pantry</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tomatoes"
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-sage-900 mb-2 block">Quantity</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-sage-900 mb-2 block">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sage-900 focus:ring-2 focus:ring-sage-500"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-sage-900 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${category === c ? 'bg-sage-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky footer CTA — always visible */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full bg-sage-900 text-white font-medium py-3.5 rounded-2xl disabled:opacity-50 transition-opacity"
              >
                Add to Stock
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
