// Category and Product Data Management with Backend API Sync (localhost:8081)

export const CATEGORY_SECTIONS = [
  {
    id: 'all',
    name: 'All Categories',
    shortName: 'All Categories',
    headline: 'READY DESIGNS AND TRENDY CASES',
    subtitle: 'Cases & covers for 500+ phone models',
    icon: '/images/00e44de62ec83c768bb02d8f.jpg'
  },
  {
    id: 'phone_cover',
    name: 'Phone Cover',
    shortName: 'Mobile Covers',
    headline: 'READY DESIGNS AND TRENDY CASES',
    subtitle: 'Cases & covers for 500+ phone models',
    icon: '/images/00e44de62ec83c768bb02d8f.jpg'
  },
  {
    id: 'temper_glass',
    name: 'Phone Temper Glass',
    shortName: 'Temper Glass',
    headline: 'EXTREME PROTECTION TEMPER GLASS',
    subtitle: '9H Extreme screen & lens protection',
    icon: '/images/fe03231113d0c658be329806.jpg'
  },
  {
    id: 'laptop_skin',
    name: 'Phone & Laptop Skin',
    shortName: 'Skins & Wraps',
    headline: 'PREMIUM TEXTURED SKINS & WRAPS',
    subtitle: '3M Textured wraps & custom skins',
    icon: '/images/b87cc8af278adb5833b5b6b1.jpg'
  }
];

export const DEFAULT_CATEGORIES = [];
export const DEFAULT_PRODUCTS = [];

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

// API Base URLs
export const RAILWAY_API_BASE = 'https://ecom-back-production.up.railway.app/api';
export const LOCAL_API_BASE = 'http://localhost:8081/api';
export const REMOTE_API_BASE = RAILWAY_API_BASE;

const getInitialApiBase = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  return RAILWAY_API_BASE;
};

export const PRIMARY_API_BASE = getInitialApiBase();
export let API_BASE = PRIMARY_API_BASE;

// Direct, resilient API caller with timeout protection
export async function apiFetch(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const controller = new AbortController();
  // 18s timeout to accommodate cold starts and image uploads
  const timeoutId = setTimeout(() => controller.abort(), 18000);
  try {
    const res = await fetch(`${API_BASE}${cleanPath}`, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    // If running on localhost and primary API_BASE was not LOCAL_API_BASE, fallback to local backend
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && API_BASE !== LOCAL_API_BASE) {
      try {
        return await fetch(`${LOCAL_API_BASE}${cleanPath}`, options);
      } catch (_) {}
    }
    throw err;
  }
}

// Helper functions for categories (synchronous cache read)
export function getStoredCategories() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
    return (Array.isArray(custom) ? custom : [])
      .map(cat => {
        if (!cat.section) cat.section = normalizeCategorySection(cat);
        return cat;
      });
  } catch (e) {
    return [];
  }
}

// Asynchronous fetch from backend (clean GET only - NEVER auto-posts)
export async function fetchCategoriesFromApi() {
  try {
    const res = await apiFetch('/categories');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rawServerCats = await res.json();
    const serverCats = Array.isArray(rawServerCats)
      ? rawServerCats.map(c => ({ ...c, section: normalizeCategorySection(c) }))
      : [];

    try {
      localStorage.setItem('custom_categories', JSON.stringify(serverCats));
    } catch (_) {}
    return serverCats;
  } catch (e) {
    console.warn('Backend categories API unavailable, using cached categories:', e.message);
  }
  return getStoredCategories();
}

export async function saveStoredCategory(cat) {
  try {
    if (!cat.section) cat.section = normalizeCategorySection(cat);

    // 1. Persist to Backend API (PostgreSQL)
    const res = await apiFetch('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    
    let saved = cat;
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) saved = data;
    }

    // 2. Update localStorage cache safely
    try {
      const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
      const existingIndex = custom.findIndex(c => c.id === saved.id);
      if (existingIndex >= 0) {
        custom[existingIndex] = saved;
      } else {
        custom.unshift(saved);
      }
      localStorage.setItem('custom_categories', JSON.stringify(custom));
    } catch (_) {}

    return saved;
  } catch (e) {
    console.error('Failed to sync category with backend:', e);
    throw e;
  }
}

export async function deleteStoredCategory(id) {
  try {
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    try {
      const custom = JSON.parse(localStorage.getItem('custom_categories') || '[]');
      localStorage.setItem('custom_categories', JSON.stringify(custom.filter(c => c.id !== id)));
      const prods = JSON.parse(localStorage.getItem('custom_products') || '[]');
      localStorage.setItem('custom_products', JSON.stringify(prods.filter(p => p.categoryId !== id)));
    } catch (_) {}
    return res;
  } catch (e) {
    console.error('Failed to delete category on backend:', e);
    throw e;
  }
}

// Helper functions for products (synchronous cache read)
export function getStoredProducts(categoryId = null) {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
    const mockPrefixes = ['prod_mobile_', 'prod_clear_', 'prod_soft_', 'prod_silicone_', 'prod_stylish_', 'prod_name_', 'prod_magic_', 'prod_gold_', 'prod_glass_', 'prod_privacy_', 'prod_matte_', 'prod_uv_', 'prod_lens_', 'prod_laptop_', 'prod_skin_', 'prod_carbon_', 'prod_anime_', 'prod_leather_'];

    const active = (Array.isArray(custom) ? custom : [])
      .filter(prod => !mockPrefixes.some(p => prod.id && String(prod.id).startsWith(p)));

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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const serverProds = await res.json();

    if (Array.isArray(serverProds)) {
      if (!categoryId || categoryId === 'all') {
        try {
          localStorage.setItem('custom_products', JSON.stringify(serverProds));
        } catch (_) {}
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
    const res = await apiFetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    });
    if (!res.ok) {
      throw new Error(`Failed to save product to backend: HTTP ${res.status}`);
    }
    const saved = await res.json();
    try {
      const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
      const existingIndex = custom.findIndex(p => p.id === saved.id);
      if (existingIndex >= 0) {
        custom[existingIndex] = saved;
      } else {
        custom.unshift(saved);
      }
      localStorage.setItem('custom_products', JSON.stringify(custom));
    } catch (_) {}
    return saved;
  } catch (e) {
    console.error('Failed to sync product with backend:', e);
    throw e;
  }
}

export async function deleteStoredProduct(id) {
  try {
    const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });
    try {
      const custom = JSON.parse(localStorage.getItem('custom_products') || '[]');
      localStorage.setItem('custom_products', JSON.stringify(custom.filter(p => p.id !== id)));
    } catch (_) {}
    return res;
  } catch (e) {
    console.error('Failed to delete product on backend:', e);
    throw e;
  }
}

// =========================================================================
// STORIES MANAGEMENT
// =========================================================================
export const DEFAULT_STORIES = [];

export function getStoredStories() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_stories') || '[]');
    return (Array.isArray(custom) ? custom : []).map(s => {
      let imgs = Array.isArray(s.images) && s.images.length > 0
        ? s.images
        : (s.img ? [s.img] : []);
      return {
        ...s,
        images: imgs,
        img: imgs[0] || s.img || ''
      };
    });
  } catch (e) {
    return [];
  }
}

export async function fetchStoriesFromApi() {
  try {
    const res = await apiFetch('/stories');
    if (!res.ok) throw new Error('Failed to fetch stories');
    const serverStories = await res.json();
    if (Array.isArray(serverStories)) {
      const normalized = serverStories.map(s => {
        let imgs = Array.isArray(s.images) && s.images.length > 0
          ? s.images
          : (s.img ? [s.img] : []);
        return {
          ...s,
          images: imgs,
          img: imgs[0] || s.img || ''
        };
      });
      try {
        localStorage.setItem('custom_stories', JSON.stringify(normalized));
      } catch (_) {}
      return normalized;
    }
  } catch (e) {
    console.warn('Backend stories API unavailable, using cached stories:', e.message);
  }
  return getStoredStories();
}

export async function saveStoredStory(story) {
  try {
    const rawId = story.id;
    // An existing edit is when rawId is a valid backend ID (number or pure numeric string, NOT temporary 'story-...' or 'temp-')
    const isNumericId = rawId !== undefined && rawId !== null && !String(rawId).startsWith('story-') && !String(rawId).startsWith('temp-') && !isNaN(Number(rawId));
    const isEdit = Boolean(isNumericId);

    const payload = {
      name: story.name,
      img: (Array.isArray(story.images) && story.images[0]) || story.img || '',
      images: Array.isArray(story.images) ? story.images : [story.img].filter(Boolean),
      time: story.time || 'Recently added'
    };
    if (isEdit) {
      payload.id = Number(rawId);
    }

    const url = isEdit ? `/stories/${rawId}` : '/stories';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to save story: HTTP ${res.status}`);
    }
    const saved = await res.json();

    const normalizedSaved = {
      ...saved,
      images: Array.isArray(saved.images) && saved.images.length > 0 ? saved.images : (saved.img ? [saved.img] : []),
      img: saved.img || (Array.isArray(saved.images) && saved.images[0]) || '',
      time: saved.time || story.time || 'Recently added'
    };

    try {
      const current = getStoredStories();
      const idx = current.findIndex(s => s.id === normalizedSaved.id || String(s.id) === String(normalizedSaved.id));
      let updated = idx >= 0 ? [...current] : [normalizedSaved, ...current];
      if (idx >= 0) updated[idx] = normalizedSaved;
      localStorage.setItem('custom_stories', JSON.stringify(updated));
    } catch (_) {}
    return normalizedSaved;
  } catch (e) {
    console.error('Failed to save story to server, saving locally:', e);
    const fallbackStory = {
      ...story,
      id: story.id || ('story-' + Date.now()),
      img: (Array.isArray(story.images) && story.images[0]) || story.img || '',
      images: Array.isArray(story.images) ? story.images : [story.img].filter(Boolean),
      time: story.time || 'Recently added'
    };
    try {
      const current = getStoredStories();
      const idx = current.findIndex(s => s.id === fallbackStory.id || String(s.id) === String(fallbackStory.id));
      let updated = idx >= 0 ? [...current] : [fallbackStory, ...current];
      if (idx >= 0) updated[idx] = fallbackStory;
      localStorage.setItem('custom_stories', JSON.stringify(updated));
    } catch (_) {}
    return fallbackStory;
  }
}

export async function deleteStoredStory(id) {
  try {
    let res = await apiFetch(`/stories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      res = await apiFetch(`/stories/delete/${id}`, { method: 'POST' });
    }
  } catch (e) {
    console.warn('Backend delete story failed, falling back to local storage removal:', e.message);
  }
  try {
    const current = getStoredStories();
    localStorage.setItem('custom_stories', JSON.stringify(current.filter(s => s.id !== id && String(s.id) !== String(id))));
  } catch (_) {}
}

// =========================================================================
// REVIEWS MANAGEMENT
// =========================================================================
export const DEFAULT_REVIEWS = [];

export function getStoredReviews() {
  try {
    const custom = JSON.parse(localStorage.getItem('custom_reviews') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('deleted_review_ids') || '[]');
    const editedMap = JSON.parse(localStorage.getItem('edited_reviews') || '{}');

    return (Array.isArray(custom) ? custom : [])
      .filter(r => r && !deletedIds.includes(r.id) && !deletedIds.includes(String(r.id)))
      .map(r => editedMap[r.id] ? { ...r, ...editedMap[r.id] } : r);
  } catch (e) {
    return [];
  }
}

export async function fetchReviewsFromApi() {
  try {
    const res = await apiFetch('/reviews');
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const serverReviews = await res.json();
    if (Array.isArray(serverReviews)) {
      localStorage.setItem('custom_reviews', JSON.stringify(serverReviews));
      return serverReviews;
    }
  } catch (e) {
    console.warn('Backend reviews API unavailable, using cached reviews:', e.message);
  }
  return getStoredReviews();
}

export async function saveStoredReview(rev) {
  try {
    const rawId = rev.id;
    // An existing edit is when rawId is a valid backend ID (number or pure numeric string, NOT temporary 'rev-...' or 'temp-')
    const isNumericId = rawId !== undefined && rawId !== null && !String(rawId).startsWith('rev-') && !String(rawId).startsWith('temp-') && !isNaN(Number(rawId));
    const isEdit = Boolean(isNumericId);

    const payload = {
      author: rev.author,
      title: rev.title || '',
      text: rev.text,
      rating: Number(rev.rating) || 5,
      product: rev.product || '',
      verified: rev.verified !== undefined ? rev.verified : true,
      img: rev.img || null,
      createdAt: rev.createdAt || new Date().toISOString()
    };
    if (isEdit) {
      payload.id = Number(rawId);
    }

    const url = isEdit ? `/reviews/${rawId}` : '/reviews';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to save review: HTTP ${res.status}`);
    }
    const saved = await res.json();

    const current = getStoredReviews();
    const idx = current.findIndex(r => r.id === saved.id || String(r.id) === String(saved.id));
    let updated;
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = saved;
    } else {
      updated = [saved, ...current];
    }
    localStorage.setItem('custom_reviews', JSON.stringify(updated));
    return saved;
  } catch (e) {
    console.error('Failed to save review to server, saving locally:', e);
    const fallbackRev = {
      ...rev,
      id: rev.id || ('rev-' + Date.now()),
      verified: rev.verified !== undefined ? rev.verified : true,
      createdAt: rev.createdAt || new Date().toISOString()
    };
    const current = getStoredReviews();
    const idx = current.findIndex(r => r.id === fallbackRev.id || String(r.id) === String(fallbackRev.id));
    let updated = idx >= 0 ? [...current] : [fallbackRev, ...current];
    if (idx >= 0) updated[idx] = fallbackRev;
    localStorage.setItem('custom_reviews', JSON.stringify(updated));
    return fallbackRev;
  }
}

export async function deleteStoredReview(id) {
  try {
    let res = await apiFetch(`/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      res = await apiFetch(`/reviews/delete/${id}`, { method: 'POST' });
    }
  } catch (e) {
    console.warn('Backend delete review failed, falling back to local storage removal:', e.message);
  }
  try {
    const current = getStoredReviews();
    localStorage.setItem('custom_reviews', JSON.stringify(current.filter(r => r.id !== id && String(r.id) !== String(id))));
  } catch (_) {}
}

// =========================================================================
// ORDERS MANAGEMENT
// =========================================================================
export const DEFAULT_ORDERS = [];

export function getStoredOrders() {
  try {
    const raw = JSON.parse(localStorage.getItem('customer_orders') || '[]');
    return (Array.isArray(raw) ? raw : []).map(order => {
      let parsedItems = order.items;
      let parsedCustomer = order.customer;
      try {
        if (typeof order.items === 'string') parsedItems = JSON.parse(order.items);
      } catch (e) {}
      try {
        if (typeof order.customer === 'string') parsedCustomer = JSON.parse(order.customer);
      } catch (e) {}

      return {
        ...order,
        items: Array.isArray(parsedItems) ? parsedItems : [],
        customer: (parsedCustomer && typeof parsedCustomer === 'object') ? parsedCustomer : {},
        isPaid: Boolean(order.isPaid)
      };
    });
  } catch (e) {
    return [];
  }
}

export async function fetchOrdersFromApi() {
  try {
    const response = await apiFetch('/orders');
    if (response.ok) {
      const dbOrders = await response.json();
      if (Array.isArray(dbOrders)) {
        const formatted = dbOrders.map(order => {
          let parsedItems = order.items;
          let parsedCustomer = order.customer;
          try {
            if (typeof order.items === 'string') parsedItems = JSON.parse(order.items);
          } catch (e) {}
          try {
            if (typeof order.customer === 'string') parsedCustomer = JSON.parse(order.customer);
          } catch (e) {}
          return {
            ...order,
            items: Array.isArray(parsedItems) ? parsedItems : [],
            customer: (parsedCustomer && typeof parsedCustomer === 'object') ? parsedCustomer : {},
            isPaid: Boolean(order.isPaid)
          };
        }).reverse();
        localStorage.setItem('customer_orders', JSON.stringify(formatted));
        return formatted;
      }
    }
  } catch (e) {
    console.warn('Backend orders offline, using cache:', e.message);
  }
  return getStoredOrders();
}

export async function saveStoredOrder(order) {
  try {
    const backendPayload = {
      orderId: order.orderId,
      date: order.date,
      items: typeof order.items === 'string' ? order.items : JSON.stringify(order.items || []),
      customer: typeof order.customer === 'string' ? order.customer : JSON.stringify(order.customer || {}),
      total: String(order.total || '0'),
      shipping: order.shipping || 'Free',
      isPaid: Boolean(order.isPaid)
    };

    const res = await apiFetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload)
    });
    if (!res.ok) {
      throw new Error(`Failed to save order to backend: HTTP ${res.status}`);
    }
    const saved = await res.json();
    const orders = getStoredOrders();
    const existingIdx = orders.findIndex(o => o.orderId === (saved.orderId || order.orderId));
    let updated;
    if (existingIdx >= 0) {
      updated = [...orders];
      updated[existingIdx] = order;
    } else {
      updated = [order, ...orders];
    }
    localStorage.setItem('customer_orders', JSON.stringify(updated));
    return order;
  } catch (e) {
    console.error('Failed to save order:', e);
    throw e;
  }
}

export async function deleteStoredOrder(orderId) {
  try {
    const res = await apiFetch(`/orders/${orderId}`, { method: 'DELETE' });
    const current = getStoredOrders();
    const filtered = current.filter(o => o.orderId !== orderId && String(o.id) !== String(orderId));
    localStorage.setItem('customer_orders', JSON.stringify(filtered));
    return res;
  } catch (e) {
    console.error('Failed to delete order:', e);
    throw e;
  }
}

export async function updateStoredOrderStatus(orderId, isPaid) {
  try {
    const res = await apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid })
    });
    const current = getStoredOrders();
    const updated = current.map(o => (o.orderId === orderId || String(o.id) === String(orderId)) ? { ...o, isPaid } : o);
    localStorage.setItem('customer_orders', JSON.stringify(updated));
    return res;
  } catch (e) {
    console.error('Failed to update order status:', e);
    throw e;
  }
}

