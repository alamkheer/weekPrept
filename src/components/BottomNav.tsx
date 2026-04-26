import React from 'react';
import { Calendar, BookOpen, Package, ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'pantry', label: 'Pantry', icon: Package },
    { id: 'list', label: 'Shop', icon: ShoppingCart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage-100 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-sage-600" : "text-gray-400 hover:text-sage-500"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} className={cn(isActive && "stroke-2")} />
              <span className="text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
