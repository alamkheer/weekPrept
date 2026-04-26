import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Minus } from 'lucide-react';
import { AddInventorySheet } from '../components/AddInventorySheet';

export function PantryView() {
  const { inventory, updateInventoryQuantity } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div 
          onClick={() => setIsAddOpen(true)}
          className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="text-sm font-medium text-sage-900">Quick Add Item</div>
          <button className="bg-sage-600 text-white w-8 h-8 rounded-full flex items-center justify-center pointer-events-none">
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {inventory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-1">{item.category}</div>
                <h4 className="font-medium text-sage-900">{item.name}</h4>
              </div>
              
              <div className="flex items-center gap-3 bg-sand-50 rounded-full p-1 border border-sage-100">
                <button 
                  onClick={() => updateInventoryQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sage-600 hover:bg-sage-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-16 text-center font-medium text-sage-900 text-sm">
                  {item.quantity} <span className="text-xs text-gray-500 font-normal">{item.unit !== 'item' ? item.unit : ''}</span>
                </div>
                <button 
                  onClick={() => updateInventoryQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-sage-600 hover:bg-sage-100 transition-colors"
                  >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddInventorySheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </>
  );
}
