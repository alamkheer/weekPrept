import React, { useState } from 'react';
import { BottomNav } from './BottomNav';
import { PlanView } from '../views/PlanView';
import { RecipesView } from '../views/RecipesView';
import { PantryView } from '../views/PantryView';
import { ListView } from '../views/ListView';

export function Layout() {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div className="min-h-screen bg-sand-50 pb-20">
      <header className="bg-white px-6 pt-12 pb-4 shadow-sm sticky top-0 z-40">
        <h1 className="font-serif text-3xl text-sage-900 font-semibold tracking-tight">
          {activeTab === 'plan' && 'This Week'}
          {activeTab === 'recipes' && 'Recipes'}
          {activeTab === 'pantry' && 'Your Pantry'}
          {activeTab === 'list' && 'Shopping List'}
        </h1>
      </header>
      
      <main className="p-4 sm:p-6 max-w-2xl mx-auto">
        {activeTab === 'plan' && <PlanView />}
        {activeTab === 'recipes' && <RecipesView />}
        {activeTab === 'pantry' && <PantryView />}
        {activeTab === 'list' && <ListView />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
