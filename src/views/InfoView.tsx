import React from 'react';
import { Calendar, Package, ShoppingCart, BookOpen, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    color: 'bg-sage-100 text-sage-600',
    title: 'Plan Your Week',
    desc: 'Lay out all your meals for the next 7 days in one glance. Drag & assign any recipe to any day.',
  },
  {
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-600',
    title: 'Recipe Library',
    desc: 'Save your favourite recipes with ingredients. WeekPrept tells you what you can cook right now.',
  },
  {
    icon: Package,
    color: 'bg-blue-50 text-blue-500',
    title: 'Smart Pantry',
    desc: 'Track what you have at home. Quantities update automatically as you plan meals.',
  },
  {
    icon: ShoppingCart,
    color: 'bg-rose-50 text-rose-500',
    title: 'Auto Shopping List',
    desc: 'We calculate exactly what to buy — subtracting what you already have in the pantry.',
  },
];

const steps = [
  { n: '01', title: 'Add your pantry items', desc: 'Start by logging what you currently have at home in the Pantry tab.' },
  { n: '02', title: 'Browse or add recipes', desc: 'Go to Recipes and add your favourite meals with their ingredients.' },
  { n: '03', title: 'Plan the week', desc: 'Tap "Add meal" on any day in the Plan tab and assign a recipe.' },
  { n: '04', title: 'Shop smart', desc: 'Head to the Shop tab — your shopping list is already calculated and ready.' },
];

export function InfoView() {
  return (
    <div className="space-y-10 pb-10">

      {/* Hero */}
      <div className="text-center pt-4 pb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-600 text-white text-3xl mb-4 shadow-lg shadow-sage-200">
          🥗
        </div>
        <h2 className="font-serif text-3xl font-semibold text-sage-900 mb-2">WeekPrept</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Effortless weekly meal planning — from pantry to plate, without the guesswork.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4">What it does</h3>
        <div className="space-y-3">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="font-semibold text-sage-900 text-sm mb-0.5">{title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4">How to get started</h3>
        <div className="space-y-3">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sage-900 text-white flex items-center justify-center flex-shrink-0 font-serif text-sm font-bold">
                {n}
              </div>
              <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="font-semibold text-sage-900 text-sm mb-0.5">{title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-sage-50 border border-sage-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-sage-600" />
          <span className="font-semibold text-sage-900 text-sm">Pro Tips</span>
        </div>
        <ul className="space-y-2">
          {[
            'Tap any recipe card to see full ingredients & instructions.',
            'The green "Make it now" badge means you have all ingredients.',
            'Checked items on the shopping list stay checked until you reopen the app.',
            'Long-tap a pantry item to quickly delete or edit it.',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-xs text-sage-700">
              <CheckCircle size={14} className="text-sage-500 mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 space-y-1">
        <div className="font-medium text-sage-500">WeekPrept v1.0</div>
        <div>Built with ❤️ for smarter meal planning.</div>
      </div>
    </div>
  );
}
