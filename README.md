# 🥗 WeekPrept

**Your weekly meal planner — from pantry to plate, without the guesswork.**

WeekPrept helps you plan meals for the week, track what's in your pantry, and automatically generate a smart shopping list that only includes what you actually need to buy.

---

## Features

| Feature | Description |
|---------|-------------|
| **Weekly Meal Plan** | Assign recipes to any day across a 7-day rolling calendar |
| **Recipe Library** | Save recipes with structured ingredients; see what you can cook right now based on pantry stock |
| **Smart Pantry** | Track quantities of what you have at home, grouped by category |
| **Auto Shopping List** | Calculates exactly what to buy by subtracting pantry stock from planned meals |
| **Recipe Details** | Tap any recipe card or planned meal to see full ingredients (colour-coded by stock status) and step-by-step instructions |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev/) with TypeScript |
| Build | [Vite 6](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite` plugin) |
| Animations | [Motion](https://motion.dev/) (formerly Framer Motion) |
| Icons | [Lucide React](https://lucide.dev/) |
| Dates | [date-fns](https://date-fns.org/) |
| Fonts | Inter (sans), Playfair Display (serif) — via Google Fonts |

---

## Project Structure

```
weekPrept/
├── index.html                  # Entry HTML — title, favicon, meta tags
├── vite.config.ts              # Vite config — Tailwind plugin, env loading, aliases
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
│
└── src/
    ├── main.tsx                # React DOM entry point
    ├── App.tsx                 # Root component — wraps everything in AppProvider
    ├── index.css               # Global styles — fonts, Tailwind theme tokens (sage/sand palette)
    ├── types.ts                # Shared TypeScript types (Recipe, InventoryItem, MealSlot, etc.)
    │
    ├── store/
    │   └── AppContext.tsx       # React Context provider — all app state and actions
    │
    ├── data/
    │   └── mock.ts             # Seed data — sample recipes, inventory, meal plan
    │
    ├── lib/
    │   └── utils.ts            # Utility: cn() — clsx + tailwind-merge
    │
    ├── views/                  # Full-page views (one per tab)
    │   ├── PlanView.tsx        # Weekly calendar with meal entries
    │   ├── RecipesView.tsx     # Recipe cards sorted by pantry match
    │   ├── PantryView.tsx      # Inventory list grouped by category
    │   ├── ListView.tsx        # Auto-generated shopping list
    │   └── InfoView.tsx        # About / help page
    │
    └── components/             # Shared UI components
        ├── Layout.tsx          # App shell — header (WP brand + info icon) + tab routing
        ├── BottomNav.tsx       # Fixed bottom tab bar (Plan / Recipes / Pantry / Shop)
        ├── RecipeDetailSheet.tsx    # Bottom drawer — full recipe details + ingredients vs stock
        ├── PlanMealSheet.tsx       # Bottom drawer — assign a recipe to a day
        ├── AddRecipeSheet.tsx      # Bottom drawer — create a new recipe
        └── AddInventorySheet.tsx   # Bottom drawer — add a pantry item
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (bundled with Node) or **pnpm**

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/weekPrept.git
cd weekPrept

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server on port 3000 |
| `build` | `npm run build` | Production build to `dist/` |
| `preview` | `npm run preview` | Preview the production build locally |
| `lint` | `npm run lint` | Type-check with `tsc --noEmit` |
| `clean` | `npm run clean` | Remove the `dist/` directory |

### Environment Variables

Copy `.env.example` to `.env.local` and set values if needed. Currently the app runs entirely client-side with mock data, so no API keys are required for basic usage.

```bash
cp .env.example .env.local
```

---

## Architecture Overview

### State Management

All state lives in a single **React Context** (`AppContext.tsx`):

- `inventory` — pantry items with quantities
- `recipes` — recipe library
- `mealPlan` — scheduled meals (date + recipe + meal type)
- `shoppingList` — **derived** automatically via `useMemo` from `mealPlan` + `inventory`

Actions exposed: `addInventoryItem`, `removeInventoryItem`, `updateInventoryQuantity`, `addRecipe`, `scheduleMeal`, `removeMeal`.

### Navigation

Tab-based routing managed by a `useState` in `Layout.tsx`. The four main tabs are rendered by `BottomNav`. The Info page is accessed via a header icon button (not a bottom tab).

### Bottom Sheets

All modals use a consistent pattern:
- `motion/react` for spring-animated slide-up + backdrop
- **`flex flex-col`** layout with a `flex-shrink-0` sticky footer so the CTA button is always visible
- Escape key dismisses sheets; backdrop click also closes
- Body scroll is locked while a sheet is open

### Design Tokens

The colour palette is defined as CSS custom properties in `index.css` via Tailwind's `@theme`:

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-50` | `#f4f6f4` | Light backgrounds |
| `sage-100` | `#e3ebe3` | Borders, subtle fills |
| `sage-500` | `#677b67` | Secondary text, icons |
| `sage-600` | `#546554` | Primary accent, CTAs |
| `sage-900` | `#2a332a` | Headings, dark text |
| `sand-50` | `#faf9f6` | Page background |
| `sand-100` | `#f5f2ed` | Card backgrounds |

---

## Data Model

```typescript
// Core types — see src/types.ts for full definitions

Recipe       { id, name, description, image, prepTime, ingredients[], instructions[] }
Ingredient   { id, name, quantity, unit }
InventoryItem { id, name, quantity, unit, category }
MealSlot     { id, date, recipeId, mealType }
ShoppingListItem { name, quantityNeeded, quantityInStock, quantityToBuy, unit, isChecked }
```

The shopping list is **computed, not stored** — it's derived each render from `mealPlan × recipes − inventory`.

---

## Future Improvements

- [ ] **Persistent storage** — localStorage or IndexedDB so data survives refresh
- [ ] **Recipe editing / deletion** — currently recipes can only be added
- [ ] **Drag-and-drop** meal planning on the calendar
- [ ] **Recipe import** — parse ingredients from a URL or pasted text
- [ ] **Gemini AI integration** — recipe suggestions based on pantry contents (API key already scaffolded)
- [ ] **PWA support** — service worker + manifest for offline use
- [ ] **Unit conversion** — smart normalisation (e.g. 1000g → 1kg)
- [ ] **Multi-week planning** — extend beyond 7 days

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

---

## License

This project is for personal use. See the source files for individual license headers where applicable.
