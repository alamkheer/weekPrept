import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Minus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AddInventorySheet } from '../components/AddInventorySheet';

export function PantryView() {
  const { inventory, updateInventoryQuantity, removeInventoryItem } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Group by category for better scanning
  const categories = Array.from(new Set(inventory.map(i => i.category))).sort();

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

        {categories.map(category => {
          const items = inventory.filter(i => i.category === category);
          return (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-2 px-1">{category}</h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                      {/* Main row */}
                      <div className="p-4 flex items-center justify-between">
                        <button
                          className="flex-1 text-left flex items-center gap-2 min-w-0"
                          onClick={() => toggleExpand(item.id)}
                          aria-expanded={isExpanded}
                          aria-label={`${item.name} — tap to ${isExpanded ? 'collapse' : 'expand'}`}
                        >
                          <div className="min-w-0">
                            <h4 className="font-medium text-sage-900 truncate">{item.name}</h4>
                          </div>
                          {isExpanded
                            ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                            : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
                        </button>
                        
                        <div className="flex items-center gap-3 bg-sand-50 rounded-full p-1 border border-sage-100 ml-3 flex-shrink-0">
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

                      {/* Expanded detail panel */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex items-center justify-between gap-4">
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <div><span className="font-semibold text-sage-700">Category:</span> {item.category}</div>
                            <div><span className="font-semibold text-sage-700">Unit:</span> {item.unit}</div>
                            <div><span className="font-semibold text-sage-700">In stock:</span> {item.quantity} {item.unit !== 'item' ? item.unit : 'item(s)'}</div>
                          </div>
                          <button
                            onClick={() => {
                              removeInventoryItem(item.id);
                              setExpandedId(null);
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {inventory.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm">Your pantry is empty.<br/>Add some items to get started.</p>
          </div>
        )}
      </div>

      <AddInventorySheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </>
  );
}
