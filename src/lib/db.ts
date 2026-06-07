import { Recipe, MealSlot } from '../types';

const DB_NAME = 'weekPreptDB';
const DB_VERSION = 2;
const RECIPES_STORE = 'recipes';
const MEAL_PLAN_STORE = 'mealPlan';

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(RECIPES_STORE)) {
        db.createObjectStore(RECIPES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(MEAL_PLAN_STORE)) {
        db.createObjectStore(MEAL_PLAN_STORE, { keyPath: 'id' });
      }
    };
  });
}

// Recipes methods
export async function getRecipes(): Promise<Recipe[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(RECIPES_STORE, 'readonly');
    const store = transaction.objectStore(RECIPES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(RECIPES_STORE, 'readwrite');
    const store = transaction.objectStore(RECIPES_STORE);
    const request = store.put(recipe);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteRecipeFromDB(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(RECIPES_STORE, 'readwrite');
    const store = transaction.objectStore(RECIPES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(RECIPES_STORE, 'readwrite');
    const store = transaction.objectStore(RECIPES_STORE);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    recipes.forEach((recipe) => {
      store.put(recipe);
    });
  });
}

// MealPlan methods
export async function getMealPlan(): Promise<MealSlot[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEAL_PLAN_STORE, 'readonly');
    const store = transaction.objectStore(MEAL_PLAN_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveMealSlot(slot: MealSlot): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEAL_PLAN_STORE, 'readwrite');
    const store = transaction.objectStore(MEAL_PLAN_STORE);
    const request = store.put(slot);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteMealSlot(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEAL_PLAN_STORE, 'readwrite');
    const store = transaction.objectStore(MEAL_PLAN_STORE);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveMealPlan(slots: MealSlot[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEAL_PLAN_STORE, 'readwrite');
    const store = transaction.objectStore(MEAL_PLAN_STORE);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    slots.forEach((slot) => {
      store.put(slot);
    });
  });
}

export async function clearMealPlanForRecipe(recipeId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEAL_PLAN_STORE, 'readwrite');
    const store = transaction.objectStore(MEAL_PLAN_STORE);

    const request = store.getAll();
    request.onsuccess = () => {
      const allSlots = request.result as MealSlot[];
      const slotsToDelete = allSlots.filter((slot) => slot.recipeId === recipeId);
      
      let deletedCount = 0;
      if (slotsToDelete.length === 0) {
        resolve();
        return;
      }

      slotsToDelete.forEach((slot) => {
        const deleteReq = store.delete(slot.id);
        deleteReq.onsuccess = () => {
          deletedCount++;
          if (deletedCount === slotsToDelete.length) {
            resolve();
          }
        };
        deleteReq.onerror = () => {
          reject(deleteReq.error);
        };
      });
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
