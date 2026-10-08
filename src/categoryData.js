// Category and Product Data Management with Backend API Sync (localhost:8081)

export const DEFAULT_CATEGORIES = [];
export const DEFAULT_PRODUCTS = [];

const API_BASE = 'http://localhost:8081/api';

// Helper functions for categories (synchronous cache read)
export function getStoredCategories() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('deleted_category_ids') || '[]');
    const editedMap = JSON.parse(localStorage.getItem('edited_categories') || '{}');

    return custom
      .filter(cat => !deletedIds.includes(cat.id))
      .map(cat => editedMap[cat.id] ? { ...cat, ...editedMap[cat.id] } : cat);
  } catch (e) {
    return [];
  }
}

// Asynchronous fetch from backend with 2-way sync
export async function fetchCategoriesFromApi() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const serverCats = await res.json();

    // Check if local storage has any categories not yet synced to backend
    const localCats = getStoredCategories();
    if (Array.isArray(localCats) && localCats.length > 0) {
      const serverIds = new Set((serverCats || []).map(c => c.id));
      for (const locCat of localCats) {
        if (!serverIds.has(locCat.id)) {
          // Push locally created category to backend
          try {
            await fetch(`${API_BASE}/categories`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(locCat)
            });
            serverCats.push(locCat);
          } catch (e) {
            console.error('Error syncing local category to server', e);
          }
        }
      }
    }

    if (Array.isArray(serverCats)) {
      localStorage.setItem('custom_categories', JSON.stringify(serverCats));
      return serverCats;
    }
  } catch (e) {
    console.warn('Backend categories API unavailable, using cached categories:', e.message);
  }
  return getStoredCategories();
}

export async function saveStoredCategory(cat) {
  try {
    // 1. Update localStorage cache immediately
    const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
    const existingIndex = custom.findIndex(c => c.id === cat.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = cat;
    } else {
      custom.unshift(cat);
    }
    localStorage.setItem('custom_categories', JSON.stringify(custom));

    const editedMap = JSON.parse(localStorage.getItem('edited_categories') || '{}');
    editedMap[cat.id] = cat;
    localStorage.setItem('edited_categories', JSON.stringify(editedMap));

    // 2. Persist to Backend API
    await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
  } catch (e) {
    console.error('Failed to sync category with backend:', e);
  }
}

export async function deleteStoredCategory(id) {
  try {
    // 1. LocalStorage
    const deleted = JSON.parse(localStorage.getItem('deleted_category_ids') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('deleted_category_ids', JSON.stringify(deleted));
    }
    const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
    localStorage.setItem('custom_categories', JSON.stringify(custom.filter(c => c.id !== id)));

    // Also delete products under this category
    const prods = JSON.parse(localStorage.getItem('custom_products') || '[]');
    localStorage.setItem('custom_products', JSON.stringify(prods.filter(p => p.categoryId !== id)));

    // 2. Backend API
    await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Failed to delete category on backend:', e);
  }
}

// Helper functions for products (synchronous cache read)
export function getStoredProducts(categoryId = null) {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('deleted_product_ids') || '[]');
    const editedMap = JSON.parse(localStorage.getItem('edited_products') || '{}');

    const active = custom
      .filter(prod => !deletedIds.includes(prod.id))
      .map(prod => editedMap[prod.id] ? { ...prod, ...editedMap[prod.id] } : prod);

    if (categoryId && categoryId !== 'all') {
      return active.filter(p => p.categoryId === categoryId);
    }
    return active;
  } catch (e) {
    return [];
  }
}

// Asynchronous fetch from backend with 2-way sync
export async function fetchProductsFromApi(categoryId = null) {
  try {
    const url = (categoryId && categoryId !== 'all') 
      ? `${API_BASE}/products?categoryId=${encodeURIComponent(categoryId)}`
      : `${API_BASE}/products`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    const serverProds = await res.json();

    // Check if local storage has any products not yet synced to backend
    const localProds = getStoredProducts();
    if (Array.isArray(localProds) && localProds.length > 0) {
      const serverIds = new Set((serverProds || []).map(p => p.id));
      for (const locProd of localProds) {
        if (!serverIds.has(locProd.id)) {
          // Push locally created product to backend
          try {
            await fetch(`${API_BASE}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(locProd)
            });
            serverProds.push(locProd);
          } catch (e) {
            console.error('Error syncing local product to server', e);
          }
        }
      }
    }

    if (Array.isArray(serverProds)) {
      localStorage.setItem('custom_products', JSON.stringify(serverProds));
      if (categoryId && categoryId !== 'all') {
        return serverProds.filter(p => p.categoryId === categoryId);
      }
      return serverProds;
    }
  } catch (e) {
    console.warn('Backend products API unavailable, using cached products:', e.message);
  }
  return getStoredProducts(categoryId);
}

export async function saveStoredProduct(prod) {
  try {
    // 1. Update localStorage cache immediately
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    const existingIndex = custom.findIndex(p => p.id === prod.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = prod;
    } else {
      custom.unshift(prod);
    }
    localStorage.setItem('custom_products', JSON.stringify(custom));

    const editedMap = JSON.parse(localStorage.getItem('edited_products') || '{}');
    editedMap[prod.id] = prod;
    localStorage.setItem('edited_products', JSON.stringify(editedMap));

    // 2. Persist to Backend API
    await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    });
  } catch (e) {
    console.error('Failed to sync product with backend:', e);
  }
}

export async function deleteStoredProduct(id) {
  try {
    // 1. LocalStorage
    const deleted = JSON.parse(localStorage.getItem('deleted_product_ids') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('deleted_product_ids', JSON.stringify(deleted));
    }
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    localStorage.setItem('custom_products', JSON.stringify(custom.filter(p => p.id !== id)));

    // 2. Backend API
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.error('Failed to delete product on backend:', e);
  }
}
