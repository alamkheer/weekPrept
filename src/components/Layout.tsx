import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { PlanView } from '../views/PlanView';
import { RecipesView } from '../views/RecipesView';
import { PantryView } from '../views/PantryView';
import { ListView } from '../views/ListView';
import { InfoView } from '../views/InfoView';

const TAB_TITLES: Record<string, string> = {
  plan: 'This Week',
  recipes: 'Recipes',
  pantry: 'Your Pantry',
  list: 'Shopping List',
  info: 'About',
};

export function Layout() {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div className="min-h-screen bg-sand-50 pb-20">
      <header className="bg-white px-5 pt-10 pb-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-start justify-between max-w-2xl mx-auto">
          {/* Brand mark + tab title */}
          <div>
            {/* Logo row */}
            <div className="flex items-center gap-2.5 mb-0.5">
              {/* WP monogram pill */}
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-sage-600 flex-shrink-0" aria-hidden="true">
                <span className="text-white font-serif font-bold text-sm tracking-tight leading-none">WP</span>
              </div>
              <span className="font-serif text-xl font-semibold text-sage-900 leading-tight tracking-tight">
                WeekPrept
              </span>
            </div>
            {/* Dynamic subtitle */}
            <p className="text-xs text-gray-400 font-medium pl-[42px]">
              {TAB_TITLES[activeTab]}
            </p>
          </div>

          {/* Info icon */}
          <button
            id="header-info-btn"
            onClick={() => setActiveTab(activeTab === 'info' ? 'plan' : 'info')}
            aria-label="About WeekPrept"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors mt-0.5 ${
              activeTab === 'info'
                ? 'bg-sage-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-sage-50 hover:text-sage-600'
            }`}
          >
            <Info size={18} />
          </button>
        </div>
      </header>
      
      <main className="p-4 sm:p-6 max-w-2xl mx-auto">
        {activeTab === 'plan' && <PlanView />}
        {activeTab === 'recipes' && <RecipesView />}
        {activeTab === 'pantry' && <PantryView />}
        {activeTab === 'list' && <ListView />}
        {activeTab === 'info' && <InfoView />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
