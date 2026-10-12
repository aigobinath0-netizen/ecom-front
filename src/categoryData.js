// Category and Product Data Management with Backend API Sync (localhost:8081)

export const CATEGORY_SECTIONS = [
  {
    id: 'phone_cover',
    name: 'Phone Cover',
    shortName: 'Mobile Covers',
    subtitle: 'Cases & covers for 500+ phone models',
    icon: '/images/00e44de62ec83c768bb02d8f.jpg'
  },
  {
    id: 'temper_glass',
    name: 'Phone Temper Glass',
    shortName: 'Temper Glass',
    subtitle: '9H Extreme screen & lens protection',
    icon: '/images/fe03231113d0c658be329806.jpg'
  },
  {
    id: 'laptop_skin',
    name: 'Phone & Laptop Skin',
    shortName: 'Skins & Wraps',
    subtitle: '3M Textured wraps & custom skins',
    icon: '/images/b87cc8af278adb5833b5b6b1.jpg'
  }
];

export const DEFAULT_CATEGORIES = [
  // 1. Phone Cover Section
  { id: 'cat_mobile_cover', title: 'Mobile Cover', slug: 'mobile-cover', section: 'phone_cover', image: '/images/00e44de62ec83c768bb02d8f.jpg' },
  { id: 'cat_clearprint', title: 'ClearPrint Case', slug: 'clearprint-case', section: 'phone_cover', image: '/images/013565c753f6aa4ba1700aed.png' },
  { id: 'cat_softsnap', title: 'SoftSnap Case', slug: 'softsnap-case', section: 'phone_cover', image: '/images/308338b5f835771095e9be61.jpg' },
  { id: 'cat_silicone', title: 'Soft Silicone Case', slug: 'soft-silicone-case', section: 'phone_cover', image: '/images/594fce775db07228d0094884.jpg' },
  { id: 'cat_stylish', title: 'Stylish Cases', slug: 'stylish-cases', section: 'phone_cover', image: '/images/205b687b5984e27498d34508.jpg' },
  { id: 'cat_name', title: 'Name Case', slug: 'name-case', section: 'phone_cover', image: '/images/5614fd0ad59c8c744a12c6bd.jpg' },
  { id: 'cat_magic', title: 'Magic Cases', slug: 'magic-cases', section: 'phone_cover', image: '/images/cf3d996fc4e122e8f0c754e0.jpg' },
  { id: 'cat_gold', title: 'Gold Glass Cases', slug: 'gold-glass', section: 'phone_cover', image: '/images/cbc1b6cf20352ddf3a8de09b.jpg' },

  // 2. Phone Temper Glass Section
  { id: 'cat_9h_glass', title: '9H Toughened Glass', slug: '9h-toughened-glass', section: 'temper_glass', image: '/images/fe03231113d0c658be329806.jpg' },
  { id: 'cat_privacy_glass', title: 'Privacy Tempered Glass', slug: 'privacy-tempered-glass', section: 'temper_glass', image: '/images/1b9a2ed2b6358ff443ceb435.webp' },
  { id: 'cat_matte_glass', title: 'Matte Anti-Glare Glass', slug: 'matte-anti-glare-glass', section: 'temper_glass', image: '/images/16f4f1be82b6ebae76c0e3ec.png' },
  { id: 'cat_uv_glass', title: 'UV Curved Glass', slug: 'uv-curved-glass', section: 'temper_glass', image: '/images/20b179b4f4aaaba367c2340b.png' },
  { id: 'cat_camera_lens', title: 'Camera Lens Protector', slug: 'camera-lens-protector', section: 'temper_glass', image: '/images/2654fd1670ded5fc75814adf.png' },

  // 3. Phone and Laptop Skin Section
  { id: 'cat_laptop_wraps', title: 'Laptop Wraps & Skins', slug: 'laptop-wraps', section: 'laptop_skin', image: '/images/cb38099949fdcfd5d06b9d13.jpg' },
  { id: 'cat_body_skin', title: 'Full Body Phone Skin', slug: 'full-body-phone-skin', section: 'laptop_skin', image: '/images/b87cc8af278adb5833b5b6b1.jpg' },
  { id: 'cat_carbon_skin', title: 'Carbon Fiber Texture Skin', slug: 'carbon-fiber-skin', section: 'laptop_skin', image: '/images/c91763e18dbd1daedb47c48b.jpg' },
  { id: 'cat_anime_skin', title: 'Anime & Art Skins', slug: 'anime-art-skins', section: 'laptop_skin', image: '/images/775458021d53df2ec155cb9f.jpg' },
  { id: 'cat_leather_wraps', title: 'Leather Finish Wraps', slug: 'leather-finish-wraps', section: 'laptop_skin', image: '/images/d894135ad1b5fabf0bda9746.jpg' }
];

export const DEFAULT_PRODUCTS = [
  { id: 'prod_magic_1', categoryId: 'cat_magic', title: 'Magic Case Example', price: 499, off: '50% off', oldPrice: 999, badge: 'SALE', image: '/images/12857815f64121652110d55a.jpg' },
  { id: 'prod_glass_1', categoryId: 'cat_9h_glass', title: '9H Extreme Glass Shield', price: 299, off: '40% off', oldPrice: 499, badge: 'BEST SELLER', image: '/images/fe03231113d0c658be329806.jpg' },
  { id: 'prod_skin_1', categoryId: 'cat_body_skin', title: 'Full Body Precision Skin', price: 399, off: '35% off', oldPrice: 599, badge: 'NEW', image: '/images/b87cc8af278adb5833b5b6b1.jpg' },
  { id: 'prod_gold_1', categoryId: 'cat_gold', title: 'Gold Glass Example', price: 499, off: '38% off', oldPrice: 799, badge: 'SALE', image: '/images/205b687b5984e27498d34508.jpg' },
  { id: 'prod_premium_1', categoryId: 'cat_stylish', title: 'Premium Glass Example', price: 599, off: '40% off', oldPrice: 999, badge: 'SALE', image: '/images/775458021d53df2ec155cb9f.jpg' }
];

// Helper to normalize or infer category section
export function normalizeCategorySection(cat) {
  if (!cat) return 'phone_cover';
  if (cat.section === 'phone_cover' || cat.section === 'temper_glass' || cat.section === 'laptop_skin') {
    return cat.section;
  }
  const t = (cat.title || '').toLowerCase();
  const s = (cat.slug || '').toLowerCase();
  if (t.includes('temper') || t.includes('lens') || t.includes('screen') || t.includes('toughened') || s.includes('temper') || s.includes('glass-shield')) {
    return 'temper_glass';
  }
  if (t.includes('skin') || t.includes('wrap') || t.includes('carbon') || s.includes('skin') || s.includes('wrap')) {
    return 'laptop_skin';
  }
  return 'phone_cover';
}

export const PRIMARY_API_BASE = 'http://localhost:8081/api';
export const REMOTE_API_BASE = 'https://ecom-back-kwol.onrender.com/api';

// Prefer local backend when on localhost, fallback to Render
export let API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? PRIMARY_API_BASE
  : REMOTE_API_BASE;

// Resilient API caller with instant local attempt and automatic remote fallback
export async function apiFetch(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // 1. Try local port 8081 first if on localhost with 2s timeout
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const localRes = await fetch(`${PRIMARY_API_BASE}${cleanPath}`, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (localRes.ok || localRes.status < 500) {
        API_BASE = PRIMARY_API_BASE;
        return localRes;
      }
    } catch (e) {
      // Local backend offline or timed out, seamlessly proceed to remote
    }
  }

  // 2. Remote Render backend fallback
  API_BASE = REMOTE_API_BASE;
  return fetch(`${REMOTE_API_BASE}${cleanPath}`, options);
}

// Helper functions for categories (synchronous cache read)
export function getStoredCategories() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('deleted_category_ids') || '[]');
    const editedMap = JSON.parse(localStorage.getItem('edited_categories') || '{}');

    return (Array.isArray(custom) ? custom : [])
      .filter(cat => !deletedIds.includes(cat.id))
      .map(cat => {
        const merged = editedMap[cat.id] ? { ...cat, ...editedMap[cat.id] } : cat;
        if (!merged.section) merged.section = normalizeCategorySection(merged);
        return merged;
      });
  } catch (e) {
    return [];
  }
}

// Asynchronous fetch from backend (clean GET only - NEVER auto-posts)
export async function fetchCategoriesFromApi() {
  try {
    const res = await apiFetch('/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const rawServerCats = await res.json();
    const serverCats = Array.isArray(rawServerCats)
      ? rawServerCats.map(c => ({ ...c, section: normalizeCategorySection(c) }))
      : [];

    localStorage.setItem('custom_categories', JSON.stringify(serverCats));
    return serverCats;
  } catch (e) {
    console.warn('Backend categories API unavailable, using cached categories:', e.message);
  }
  return getStoredCategories();
}

export async function saveStoredCategory(cat) {
  try {
    if (!cat.section) cat.section = normalizeCategorySection(cat);

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
    const res = await apiFetch('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    return res;
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
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    return res;
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

    const active = (Array.isArray(custom) ? custom : [])
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

// Asynchronous fetch from backend (clean GET only - NEVER auto-posts)
export async function fetchProductsFromApi(categoryId = null) {
  try {
    const url = (categoryId && categoryId !== 'all') 
      ? `/products?categoryId=${encodeURIComponent(categoryId)}`
      : '/products';
    
    const res = await apiFetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    const serverProds = await res.json();

    if (Array.isArray(serverProds)) {
      if (!categoryId || categoryId === 'all') {
        localStorage.setItem('custom_products', JSON.stringify(serverProds));
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
    const res = await apiFetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    });
    return res;
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
    const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });
    return res;
  } catch (e) {
    console.error('Failed to delete product on backend:', e);
  }
}

