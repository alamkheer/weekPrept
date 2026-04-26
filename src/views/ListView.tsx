import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Check } from 'lucide-react';

export function ListView() {
  const { shoppingList } = useApp();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (name: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(name)) {
      newChecked.delete(name);
    } else {
      newChecked.add(name);
    }
    setCheckedItems(newChecked);
  };

  if (shoppingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center mt-12">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="font-serif text-xl text-sage-900 mb-2">You have everything!</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Based on your meal plan and pantry, you don't need to buy anything right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-sage-50 text-sage-900 p-4 rounded-xl text-sm border border-sage-100">
        <p>
          <strong className="font-semibold">Smart List:</strong> We calculated exactly what you need based on your scheduled meals and subtracted what's already in your pantry.
        </p>
      </div>

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {shoppingList.map((item, idx) => {
          const isChecked = checkedItems.has(item.name);
          return (
            <div 
              key={idx} 
              onClick={() => toggleCheck(item.name)}
              className={`bg-white rounded-2xl p-4 shadow-sm border flex items-start gap-4 cursor-pointer transition-colors ${isChecked ? 'border-sage-200 bg-sage-50/50' : 'border-gray-100'}`}
            >
              <button 
                className={`mt-1 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isChecked ? 'bg-sage-500 border-sage-500 text-white' : 'border-sage-500 text-transparent'}`}
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <div className={`flex-1 transition-opacity ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                <h4 className={`font-medium text-sage-900 capitalize ${isChecked ? 'line-through' : ''}`}>{item.name}</h4>
                <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                  <span className="bg-sage-100 text-sage-600 px-2 py-1 rounded-md font-medium">
                    Buy {item.quantityToBuy} {item.unit !== 'item' ? item.unit : ''}
                  </span>
                  
                  {/* Transparency for trust */}
                  {item.quantityInStock > 0 && (
                    <span className="text-gray-400 line-through">
                      Need {item.quantityNeeded}
                    </span>
                  )}
                  {item.quantityInStock > 0 && (
                    <span className="text-gray-500">
                      (Have {item.quantityInStock})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

