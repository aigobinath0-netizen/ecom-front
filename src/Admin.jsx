import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Edit3, 
  X, 
  Plus, 
  FolderPlus, 
  PackagePlus, 
  Eye, 
  Layers, 
  Star, 
  Tag, 
  Check, 
  Sparkles,
  ShoppingBag,
  Users,
  Search,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  Printer,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getStoredCategories, 
  saveStoredCategory, 
  deleteStoredCategory, 
  getStoredProducts, 
  saveStoredProduct, 
  deleteStoredProduct,
  fetchCategoriesFromApi,
  fetchProductsFromApi,
  getStoredStories,
  saveStoredStory,
  deleteStoredStory,
  fetchStoriesFromApi,
  getStoredReviews,
  saveStoredReview,
  deleteStoredReview,
  fetchReviewsFromApi,
  getStoredOrders,
  saveStoredOrder,
  deleteStoredOrder,
  updateStoredOrderStatus,
  fetchOrdersFromApi,
  normalizeCategorySection,
  apiFetch,
  API_BASE
} from './categoryData';

export default function Admin({ setCurrentPage, onSelectCategory }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Main Section Navigation: 'categories', 'products', 'stories', 'reviews'
  const [mainSection, setMainSection] = useState('categories');
  const [activeSubTab, setActiveSubTab] = useState('manage-categories'); // 'create-category', 'manage-categories', 'create-product', 'manage-products', 'post-story', 'manage-stories', 'post-review', 'manage-reviews'

  // Categories & Products state
  const [orderFilter, setOrderFilter] = useState('all');
  const [categories, setCategories] = useState(getStoredCategories);
  const [products, setProducts] = useState(getStoredProducts);
  const [productFilterCategory, setProductFilterCategory] = useState('all');

  // New Category form state
  const [newCategory, setNewCategory] = useState({
    title: '',
    section: 'phone_cover',
    image: null,
    bannerImage: null,
    bannerType: 'split',
    bannerHeadline: 'Make Your Smartphone Case Stand Out From The Crowd',
    startingPrice: 499
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySectionFilter, setCategorySectionFilter] = useState('all');

  // New Product form state
  const [newProduct, setNewProduct] = useState({
    categoryId: '',
    title: '',
    price: 499,
    oldPrice: 999,
    off: '50% off',
    badge: 'SALE',
    image: null
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Stories state
  const [storyName, setStoryName] = useState('');
  const [storyImages, setStoryImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [existingStories, setExistingStories] = useState(getStoredStories);
  const [editingStory, setEditingStory] = useState(null);

  // Reviews state
  const [reviewData, setReviewData] = useState({
    author: '',
    title: '',
    text: '',
    rating: 5,
    product: '',
    verified: true
  });
  const [reviewImage, setReviewImage] = useState(null);
  const [existingReviews, setExistingReviews] = useState(getStoredReviews);
  const [editingReview, setEditingReview] = useState(null);

  // Orders state
  const [orders, setOrders] = useState(getStoredOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('admin_logged_in', 'true');
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  // Initial Data Load with Backend API Sync
  const refreshCategoriesAndProducts = async () => {
    setCategories(getStoredCategories());
    setProducts(getStoredProducts());
    try {
      const liveCats = await fetchCategoriesFromApi();
      const liveProds = await fetchProductsFromApi();
      if (Array.isArray(liveCats)) setCategories(liveCats);
      if (Array.isArray(liveProds)) setProducts(liveProds);

      if (Array.isArray(liveCats) && liveCats.length > 0 && !newProduct.categoryId) {
        setNewProduct(prev => ({ ...prev, categoryId: liveCats[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExistingStories = async () => {
    setExistingStories(getStoredStories());
    try {
      const liveStories = await fetchStoriesFromApi();
      if (Array.isArray(liveStories)) setExistingStories(liveStories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExistingReviews = async () => {
    setExistingReviews(getStoredReviews());
    try {
      const liveReviews = await fetchReviewsFromApi();
      if (Array.isArray(liveReviews)) setExistingReviews(liveReviews);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExistingOrders = async () => {
    setOrders(getStoredOrders());
    try {
      const liveOrders = await fetchOrdersFromApi();
      if (Array.isArray(liveOrders)) setOrders(liveOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (orderIdToDelete) => {
    if (!window.confirm(`Are you sure you want to delete order "${orderIdToDelete}"?`)) return;
    try {
      await deleteStoredOrder(orderIdToDelete);
      setOrders(getStoredOrders());
      setSelectedOrder(prev => (prev && (prev.orderId === orderIdToDelete || String(prev.id) === String(orderIdToDelete)) ? null : prev));
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const toggleOrderStatus = async (orderId, currentPaidStatus) => {
    const newStatus = !currentPaidStatus;
    try {
      await updateStoredOrderStatus(orderId, newStatus);
      setOrders(getStoredOrders());
      setSelectedOrder(prev => (prev && (prev.orderId === orderId || String(prev.id) === String(orderId)) ? { ...prev, isPaid: newStatus } : prev));
    } catch (err) {
      console.error('Failed to toggle order status:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshCategoriesAndProducts();
      fetchExistingStories();
      fetchExistingReviews();
      fetchExistingOrders();
    }
  }, [isLoggedIn, mainSection]);

  // CATEGORY HANDLERS
  const handleCategoryImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryBannerImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCategory(prev => ({ ...prev, bannerImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.title.trim()) {
      alert('Please enter a category title');
      return;
    }
    const catId = 'cat-' + Date.now();
    const slug = newCategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryObj = {
      id: catId,
      title: newCategory.title.trim(),
      section: newCategory.section || 'phone_cover',
      slug: slug || catId,
      image: newCategory.image || '/images/594fce775db07228d0094884.jpg',
      bannerImage: newCategory.bannerImage || null,
      bannerType: newCategory.bannerType || 'split',
      bannerHeadline: newCategory.bannerHeadline?.trim() || 'Make Your Smartphone Case Stand Out From The Crowd',
      startingPrice: Number(newCategory.startingPrice) || 499
    };

    await saveStoredCategory(categoryObj);
    await refreshCategoriesAndProducts();
    setNewCategory({ 
      title: '', 
      section: 'phone_cover',
      image: null, 
      bannerImage: null, 
      bannerType: 'split',
      bannerHeadline: 'Make Your Smartphone Case Stand Out From The Crowd', 
      startingPrice: 499 
    });
    setActiveSubTab('manage-categories');
    alert(`Category "${categoryObj.title}" created successfully under section "${categoryObj.section}"!`);
  };

  const handleDeleteCategory = async (id, catTitle) => {
    if (!window.confirm(`Are you sure you want to delete category "${catTitle}"?`)) return;
    await deleteStoredCategory(id);
    await refreshCategoriesAndProducts();
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.title.trim()) return;
    await saveStoredCategory(editingCategory);
    await refreshCategoriesAndProducts();
    setEditingCategory(null);
    alert('Category updated successfully!');
  };

  // PRODUCT HANDLERS
  const handleProductImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (price, oldPrice) => {
    const p = Number(price);
    const op = Number(oldPrice);
    let offText = '';
    if (p > 0 && op > p) {
      const discount = Math.round(((op - p) / op) * 100);
      offText = `${discount}% off`;
    }
    return offText;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title.trim()) {
      alert('Please enter product title');
      return;
    }
    if (!newProduct.categoryId) {
      alert('Please select a category');
      return;
    }

    const prodId = 'prod-' + Date.now();
    const productObj = {
      id: prodId,
      categoryId: newProduct.categoryId,
      title: newProduct.title.trim(),
      price: Number(newProduct.price) || 499,
      oldPrice: Number(newProduct.oldPrice) || 999,
      off: newProduct.off || '50% off',
      badge: newProduct.badge || 'SALE',
      image: newProduct.image || '/images/c91763e18dbd1daedb47c48b.jpg'
    };

    await saveStoredProduct(productObj);
    await refreshCategoriesAndProducts();
    setNewProduct(prev => ({
      ...prev,
      title: '',
      image: null
    }));
    setActiveSubTab('manage-products');
    alert(`Product "${productObj.title}" added to category successfully!`);
  };

  const handleDeleteProduct = async (id, prodTitle) => {
    if (!window.confirm(`Are you sure you want to delete product "${prodTitle}"?`)) return;
    await deleteStoredProduct(id);
    await refreshCategoriesAndProducts();
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.title.trim()) return;
    await saveStoredProduct(editingProduct);
    await refreshCategoriesAndProducts();
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  // STORY HANDLERS
  const handleMultipleStoryImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveStoryImage = (indexToRemove) => {
    setStoryImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUploadStory = async (e) => {
    e.preventDefault();
    if (!storyName || storyImages.length === 0) {
      alert('Please provide a story name and at least one image');
      return;
    }
    setIsUploading(true);
    const storyId = 'story-' + Date.now();
    const payload = {
      id: storyId,
      name: storyName,
      img: storyImages[0] || null,
      images: storyImages,
      time: 'Just now'
    };

    await saveStoredStory(payload);
    await fetchExistingStories();
    setIsUploading(false);
    setStoryName('');
    setStoryImages([]);
    setActiveSubTab('manage-stories');
    alert('Story Section uploaded successfully with ' + payload.images.length + ' slides!');
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    await deleteStoredStory(id);
    await fetchExistingStories();
  };

  const handleStartEditStory = (story) => {
    let imgs = [];
    if (Array.isArray(story.images) && story.images.length > 0) imgs = [...story.images];
    else if (story.img) {
      if (story.img.includes('|||')) imgs = story.img.split('|||').filter(Boolean);
      else imgs = [story.img];
    }
    setEditingStory({
      id: story.id,
      name: story.name,
      images: imgs
    });
  };

  const handleEditStoryImagesAdd = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStory(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveEditStory = async (e) => {
    e.preventDefault();
    if (!editingStory.name || editingStory.images.length === 0) {
      alert('Please provide story name and at least one image');
      return;
    }
    const payload = {
      id: editingStory.id,
      name: editingStory.name,
      img: editingStory.images[0] || null,
      images: editingStory.images,
      time: 'Recently updated'
    };

    await saveStoredStory(payload);
    await fetchExistingStories();
    setEditingStory(null);
    alert('Story updated successfully!');
  };

  // REVIEW HANDLERS
  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReview = async (e) => {
    e.preventDefault();
    if (!reviewData.author || !reviewData.text) {
      alert('Please fill out the author name and review text');
      return;
    }
    setIsUploading(true);
    const revId = 'rev-' + Date.now();
    const payload = {
      ...reviewData,
      id: revId,
      img: reviewImage,
      createdAt: new Date().toISOString()
    };

    await saveStoredReview(payload);
    setExistingReviews(getStoredReviews());
    setIsUploading(false);
    setReviewData({
      author: '',
      title: '',
      text: '',
      rating: 5,
      product: '',
      verified: true
    });
    setReviewImage(null);
    setActiveSubTab('manage-reviews');
    alert('Customer Review published successfully!');
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    await deleteStoredReview(id);
    await fetchExistingReviews();
  };

  const handleStartEditReview = (review) => {
    setEditingReview({
      id: review.id,
      author: review.author || '',
      title: review.title || '',
      text: review.text || '',
      rating: review.rating || 5,
      product: review.product || '',
      verified: review.verified !== false,
      img: review.img || null
    });
  };

  const handleSaveEditReview = async (e) => {
    e.preventDefault();
    if (!editingReview.author || !editingReview.text) {
      alert('Please provide author name and review text');
      return;
    }
    const payload = { ...editingReview };
    await saveStoredReview(payload);
    await fetchExistingReviews();
    setEditingReview(null);
    alert('Review updated successfully!');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-zinc-50 min-h-[calc(100vh-68px)]">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-xl w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-400/20 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-black text-xl">
              PW
            </div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Admin Portal</h2>
            <p className="text-xs text-zinc-500 mt-1">Manage Categories, Products, Stories & Reviews</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="•••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-zinc-950 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-sm mt-2"
            >
              Log In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered products list
  const filteredProducts = productFilterCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === productFilterCategory);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Create Categories, Add Products into Categories, Post Stories & Reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setCurrentPage && setCurrentPage('home')}
            className="text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            Go to Store ↗
          </button>
          <button 
            type="button"
            onClick={() => {
              localStorage.removeItem('admin_logged_in');
              setIsLoggedIn(false);
              setUsername('');
              setPassword('');
            }}
            className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-5 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setMainSection('dashboard');
            setActiveSubTab('revenue');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'dashboard'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMainSection('categories');
            setActiveSubTab('manage-categories');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'categories'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <FolderPlus className="w-4 h-4 text-amber-400" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMainSection('products');
            setActiveSubTab('manage-products');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'products'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <PackagePlus className="w-4 h-4 text-amber-400" />
          <span>Products ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMainSection('stories');
            setActiveSubTab('manage-stories');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'stories'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Stories ({existingStories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMainSection('reviews');
            setActiveSubTab('manage-reviews');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'reviews'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Reviews ({existingReviews.length})</span>
        </button>

        <button
          type="button"
          id="admin-tab-orders"
          onClick={() => {
            setMainSection('orders');
            setActiveSubTab('manage-orders');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            mainSection === 'orders'
              ? 'bg-zinc-950 text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Orders ({orders.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-4 sm:p-8 mt-2">
        
        {/* ================= DASHBOARD SECTION ================= */}
        {mainSection === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-zinc-900 border-b border-zinc-200 pb-4 mb-6">Revenue Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Total Revenue</h3>
                <div className="text-3xl font-black text-amber-900">
                  ₹{orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-amber-600 mt-2 font-medium">All time placed orders</p>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Confirmed Paid</h3>
                <div className="text-3xl font-black text-emerald-900">
                  ₹{orders.filter(o => o.isPaid).reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-emerald-600 mt-2 font-medium">Revenue from paid orders</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">Items Sold</h3>
                <div className="text-3xl font-black text-blue-900">
                  {orders.filter(o => o.isPaid).reduce((sum, order) => sum + (Array.isArray(order.items) ? order.items.reduce((s, item) => s + (item.quantity || 1), 0) : 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-blue-600 mt-2 font-medium">Products from paid orders</p>
              </div>
            </div>
            
            <div className="mt-8 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Recent Activity
              </h3>
              {orders.length === 0 ? (
                <p className="text-sm text-zinc-500 font-medium">No recent orders found.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order, i) => (
                    <div key={i} className="flex justify-between items-center bg-white border border-zinc-100 p-4 rounded-xl">
                      <div>
                        <div className="text-sm font-bold text-zinc-900">{order.orderId}</div>
                        <div className="text-xs text-zinc-500">{order.date} • {order.customer?.firstName} {order.customer?.lastName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-zinc-900">₹{order.total}</div>
                        <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mt-1 ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.isPaid ? 'PAID' : 'PENDING'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <button 
                      onClick={() => setMainSection('orders')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 pt-2"
                    >
                      View all {orders.length} orders →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* ================= CATEGORIES SECTION ================= */}
        {mainSection === 'categories' && (
          <div>
            {/* Sub Tabs */}
            <div className="flex border-b border-zinc-200 mb-6 gap-6">
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'create-category'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('create-category')}
              >
                + Create Category
              </button>
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'manage-categories'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('manage-categories')}
              >
                Manage Categories ({categories.length})
              </button>
            </div>

            {/* CREATE CATEGORY FORM */}
            {activeSubTab === 'create-category' && (
              <form onSubmit={handleCreateCategory} className="max-w-xl space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    1. Select Parent Section (Choose 1 of 3)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, section: 'phone_cover' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        newCategory.section === 'phone_cover'
                          ? 'border-[#ea580c] bg-amber-50/70 text-zinc-950 ring-2 ring-[#ea580c]'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <span className="block text-xs font-extrabold text-zinc-900">📱 1. Phone Cover</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">Cases & Covers</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, section: 'temper_glass' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        newCategory.section === 'temper_glass'
                          ? 'border-[#ea580c] bg-amber-50/70 text-zinc-950 ring-2 ring-[#ea580c]'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <span className="block text-xs font-extrabold text-zinc-900">🛡️ 2. Temper Glass</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">9H, Privacy, UV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, section: 'laptop_skin' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        newCategory.section === 'laptop_skin'
                          ? 'border-[#ea580c] bg-amber-50/70 text-zinc-950 ring-2 ring-[#ea580c]'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <span className="block text-xs font-extrabold text-zinc-900">💻 3. Laptop Skin</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">Phone & Laptop Wraps</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Category Title (e.g. UV Curved Glass or TVK Acrylic Case)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Matte Anti-Glare Tempered Glass"
                    value={newCategory.title}
                    onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Category Thumbnail / Mockup Image
                  </label>
                  <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 text-center cursor-pointer relative mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImgUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-1.5">
                        <FolderPlus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">Upload Category Thumbnail</span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">JPEG, PNG, WebP</span>
                    </div>
                  </div>

                  {newCategory.image && (
                    <div className="relative inline-block border border-zinc-200 rounded-2xl p-2 bg-zinc-50">
                      <img src={newCategory.image} alt="Preview" className="w-24 h-28 object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={() => setNewCategory(prev => ({ ...prev, image: null }))}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Category Hero Frame / Banner Image (shown inside Category page) */}
                <div className="p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      Category Hero Frame / Banner Image
                    </label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      Full Frame Banner
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mb-3">
                    Upload the full banner image that will fill the top hero frame of this category page.
                  </p>
                  
                  <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-xl p-5 text-center cursor-pointer relative mb-3 bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryBannerImgUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-1.5">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-800">Upload Full Frame Banner Image</span>
                      <span className="text-[10px] text-zinc-400">PNG, JPEG, WebP</span>
                    </div>
                  </div>

                  {newCategory.bannerImage && (
                    <div className="relative inline-block border border-zinc-200 rounded-xl p-2 bg-zinc-900 mb-3 w-full">
                      <img src={newCategory.bannerImage} alt="Banner Preview" className="max-h-40 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setNewCategory(prev => ({ ...prev, bannerImage: null }))}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-zinc-950 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" /> Create Category
                </button>
              </form>
            )}

            {/* MANAGE CATEGORIES LIST */}
            {activeSubTab === 'manage-categories' && (
              <div>
                {/* Section Filter Pills */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    { id: 'all', label: `All Sections (${categories.length})` },
                    { id: 'phone_cover', label: `📱 1. Phone Cover (${categories.filter(c => normalizeCategorySection(c) === 'phone_cover').length})` },
                    { id: 'temper_glass', label: `🛡️ 2. Phone Temper Glass (${categories.filter(c => normalizeCategorySection(c) === 'temper_glass').length})` },
                    { id: 'laptop_skin', label: `💻 3. Phone & Laptop Skin (${categories.filter(c => normalizeCategorySection(c) === 'laptop_skin').length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategorySectionFilter(tab.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        categorySectionFilter === tab.id
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {categories.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-sm font-bold text-zinc-800">No categories created yet</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">Click below to create your first category</p>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('create-category')}
                      className="bg-zinc-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      + Create Category
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories
                      .filter(c => categorySectionFilter === 'all' || normalizeCategorySection(c) === categorySectionFilter)
                      .map((cat) => {
                      const prodCount = products.filter(p => p.categoryId === cat.id).length;
                      const normSec = normalizeCategorySection(cat);
                      const secName = 
                        normSec === 'temper_glass' ? '🛡️ Temper Glass' :
                        normSec === 'laptop_skin' ? '💻 Skin & Wrap' :
                        '📱 Phone Cover';
                      return (
                        <div
                          key={cat.id}
                          className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-amber-400/50 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-20 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                              <img src={cat.image} alt={cat.title} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-zinc-900 text-sm line-clamp-2">{cat.title}</h4>
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                <span className="text-[10px] font-bold text-[#ea580c] bg-amber-50 px-2 py-0.5 rounded-md">
                                  {secName}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                                  {prodCount} Products
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-zinc-100">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProduct(prev => ({ ...prev, categoryId: cat.id }));
                                  setMainSection('products');
                                  setActiveSubTab('create-product');
                                }}
                                className="text-xs font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Add Product to this Category"
                              >
                                <Plus className="w-3.5 h-3.5 text-amber-500" /> Add Product
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory({ ...cat })}
                                className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Upload or Change Frame Image for this category"
                              >
                                🖼️ Frame Image
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onSelectCategory) onSelectCategory(cat);
                                  else if (setCurrentPage) setCurrentPage('categories');
                                }}
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                                title="View Category"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory({ ...cat })}
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit Category"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.title)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= PRODUCTS SECTION ================= */}
        {mainSection === 'products' && (
          <div>
            {/* Sub Tabs */}
            <div className="flex border-b border-zinc-200 mb-6 gap-6">
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'create-product'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('create-product')}
              >
                + Add Product
              </button>
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'manage-products'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('manage-products')}
              >
                Manage Products ({products.length})
              </button>
            </div>

            {/* ADD PRODUCT FORM */}
            {activeSubTab === 'create-product' && (
              categories.length === 0 ? (
                <div className="max-w-xl text-center py-12 px-6 bg-amber-50/60 rounded-3xl border border-amber-200">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Create a Category First</h3>
                  <p className="text-xs text-zinc-600 mb-4 max-w-sm mx-auto">
                    You need to create at least one category before you can add products to it.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMainSection('categories');
                      setActiveSubTab('create-category');
                    }}
                    className="bg-zinc-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    + Create Your First Category
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateProduct} className="max-w-xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Select Category
                    </label>
                    <select
                      required
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 text-sm bg-white"
                    >
                      <option value="">-- Choose Category --</option>
                      <optgroup label="📱 1. Phone Cover">
                        {categories
                          .filter(c => normalizeCategorySection(c) === 'phone_cover')
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </optgroup>
                      <optgroup label="🛡️ 2. Phone Temper Glass">
                        {categories
                          .filter(c => normalizeCategorySection(c) === 'temper_glass')
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </optgroup>
                      <optgroup label="💻 3. Phone & Laptop Skin">
                        {categories
                          .filter(c => normalizeCategorySection(c) === 'laptop_skin')
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Product Title (e.g. Thala Thalapathy Mobile Covers)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Thala Thalapathy Mobile Covers"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          const off = handlePriceChange(val, newProduct.oldPrice);
                          setNewProduct({ ...newProduct, price: val, off: off || newProduct.off });
                        }}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        MRP / Old Price (₹)
                      </label>
                      <input
                        type="number"
                        value={newProduct.oldPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          const off = handlePriceChange(newProduct.price, val);
                          setNewProduct({ ...newProduct, oldPrice: val, off: off || newProduct.off });
                        }}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Discount Label
                      </label>
                      <input
                        type="text"
                        value={newProduct.off}
                        onChange={(e) => setNewProduct({ ...newProduct, off: e.target.value })}
                        placeholder="50% off"
                        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                      placeholder="SALE"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Product Image
                    </label>
                    <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 text-center cursor-pointer relative mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImgUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-1.5">
                          <PackagePlus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-800">Upload Product Phone Case Image</span>
                        <span className="text-[11px] text-zinc-400 mt-0.5">High quality front view</span>
                      </div>
                    </div>

                    {newProduct.image && (
                      <div className="relative inline-block border border-zinc-200 rounded-2xl p-2 bg-zinc-50">
                        <img src={newProduct.image} alt="Preview" className="w-24 h-28 object-contain rounded-xl" />
                        <button
                          type="button"
                          onClick={() => setNewProduct(prev => ({ ...prev, image: null }))}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-zinc-950 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400" /> Create Product
                  </button>
                </form>
              )
            )}

            {/* MANAGE PRODUCTS LIST */}
            {activeSubTab === 'manage-products' && (
              <div>
                {/* Filter by Category */}
                <div className="flex items-center gap-3 mb-6 bg-zinc-50 p-3 rounded-2xl border border-zinc-200/80">
                  <span className="text-xs font-bold text-zinc-700 whitespace-nowrap">Filter by Category:</span>
                  <select
                    value={productFilterCategory}
                    onChange={(e) => setProductFilterCategory(e.target.value)}
                    className="border border-zinc-200 bg-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-amber-400"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({products.filter(p => p.categoryId === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-sm font-bold text-zinc-800">No products found</p>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">Click below to add a product</p>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('create-product')}
                      className="bg-zinc-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      + Add Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((prod) => {
                    const parentCat = categories.find(c => c.id === prod.categoryId);
                    return (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-400 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative aspect-[3/4] bg-zinc-50 rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2.5">
                            <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                              {prod.badge || 'SALE'}
                            </span>
                            <img src={prod.image} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>

                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block truncate">
                            {parentCat?.title || 'General'}
                          </span>
                          <h4 className="font-bold text-zinc-900 text-xs line-clamp-2 mt-0.5">{prod.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="font-black text-zinc-950 text-sm">₹{prod.price}</span>
                            {prod.oldPrice && <span className="text-[11px] text-zinc-400 line-through">₹{prod.oldPrice}</span>}
                            {prod.off && <span className="text-[11px] text-green-600 font-bold">{prod.off}</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-zinc-100">
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...prod })}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

        {/* ================= STORIES SECTION ================= */}
        {mainSection === 'stories' && (
          <div>
            <div className="flex border-b border-zinc-200 mb-6 gap-6">
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'post-story'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('post-story')}
              >
                Post Story Section
              </button>
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'manage-stories'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('manage-stories')}
              >
                Manage Stories ({existingStories.length})
              </button>
            </div>

            {activeSubTab === 'post-story' && (
              <form onSubmit={handleUploadStory} className="max-w-xl space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Story Section Title (e.g. TVK Special Orders)
                  </label>
                  <input
                    type="text"
                    required
                    value={storyName}
                    onChange={(e) => setStoryName(e.target.value)}
                    placeholder="Happy Customers / TVK Cases"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Story Images ({storyImages.length} selected)
                    </label>
                    {storyImages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setStoryImages([])}
                        className="text-xs text-rose-500 font-semibold hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-6 text-center cursor-pointer relative mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleStoryImages}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2">
                        <Layers className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-zinc-800">Click or Drag & Drop Multiple Images</span>
                      <span className="text-xs text-zinc-500 mt-0.5">Upload multiple slides for this story highlight</span>
                    </div>
                  </div>

                  {storyImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                      {storyImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200">
                          <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {idx === 0 ? 'Cover' : `#${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStoryImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-zinc-950 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-sm"
                >
                  {isUploading ? 'Uploading...' : 'Publish Story Section'}
                </button>
              </form>
            )}

            {activeSubTab === 'manage-stories' && (
              <div className="space-y-3">
                {existingStories.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-4">No stories published yet.</p>
                ) : (
                  existingStories.map((story) => {
                    const slideCount = Array.isArray(story.images) && story.images.length > 0 
                      ? story.images.length 
                      : (story.img && story.img.includes('|||') ? story.img.split('|||').length : 1);
                    const coverImg = Array.isArray(story.images) && story.images.length > 0
                      ? story.images[0]
                      : (story.img && story.img.includes('|||') ? story.img.split('|||')[0] : story.img);

                    return (
                      <div key={story.id} className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400 p-0.5 shrink-0 bg-white">
                            <img src={coverImg} alt={story.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 text-sm">{story.name}</h4>
                            <span className="text-xs text-zinc-400">{slideCount} slides</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditStory(story)}
                            className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 rounded-xl transition-colors"
                            title="Edit Story"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
                            title="Delete Story"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= REVIEWS SECTION ================= */}
        {mainSection === 'reviews' && (
          <div>
            <div className="flex border-b border-zinc-200 mb-6 gap-6">
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'post-review'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('post-review')}
              >
                Post Review
              </button>
              <button
                type="button"
                className={`pb-3 font-bold text-sm px-1 cursor-pointer transition-colors ${
                  activeSubTab === 'manage-reviews'
                    ? 'text-zinc-950 border-b-2 border-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
                onClick={() => setActiveSubTab('manage-reviews')}
              >
                Manage Reviews ({existingReviews.length})
              </button>
            </div>

            {activeSubTab === 'post-review' && (
              <form onSubmit={handleUploadReview} className="max-w-xl space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={reviewData.author}
                      onChange={(e) => setReviewData({ ...reviewData, author: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Rating</label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm bg-white"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                      <option value={2}>2 Stars ★★☆☆☆</option>
                      <option value={1}>1 Star ★☆☆☆☆</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Review Title</label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    placeholder="Amazing Quality Case!"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Review Comment</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewData.text}
                    onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                    placeholder="The phone case arrived quickly and the print quality is top notch..."
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Product Name</label>
                  <input
                    type="text"
                    value={reviewData.product}
                    onChange={(e) => setReviewData({ ...reviewData, product: e.target.value })}
                    placeholder="TVK Acrylic Strong Glass Case"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReviewImageChange}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-xs"
                  />
                  {reviewImage && (
                    <div className="mt-2 relative inline-block">
                      <img src={reviewImage} alt="Review" className="h-16 rounded-xl border object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage(null)}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-zinc-950 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-md text-sm"
                >
                  {isUploading ? 'Publishing...' : 'Publish Customer Review'}
                </button>
              </form>
            )}

            {activeSubTab === 'manage-reviews' && (
              <div className="space-y-3">
                {existingReviews.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-4">No reviews published yet.</p>
                ) : (
                  existingReviews.map((rev) => (
                    <div key={rev.id} className="flex items-start justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                      <div className="flex items-start gap-3">
                        {rev.img ? (
                          <img src={rev.img} alt={rev.author} className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-sm">
                            {rev.author ? rev.author[0].toUpperCase() : 'U'}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 text-sm">{rev.author}</h4>
                            <span className="text-xs text-amber-500 font-bold">★ {rev.rating}</span>
                          </div>
                          {rev.title && <p className="text-xs font-semibold text-zinc-700">{rev.title}</p>}
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{rev.text}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditReview(rev)}
                          className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 rounded-xl transition-colors"
                          title="Edit Review"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= MODALS ================= */}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-black text-zinc-900 mb-5">Edit Category</h3>
            <form onSubmit={handleSaveEditCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Parent Section</label>
                <select
                  value={editingCategory.section || 'phone_cover'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, section: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm bg-white"
                >
                  <option value="phone_cover">📱 1. Phone Cover</option>
                  <option value="temper_glass">🛡️ 2. Phone Temper Glass</option>
                  <option value="laptop_skin">💻 3. Phone & Laptop Skin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Change Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingCategory(prev => ({ ...prev, image: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-xs"
                />
                {editingCategory.image && (
                  <div className="mt-2">
                    <img src={editingCategory.image} alt="Thumb" className="w-20 h-24 object-contain rounded-xl border p-1" />
                  </div>
                )}
              </div>

              {/* Edit Frame / Banner Image */}
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                    Category Hero Frame / Banner Image
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Full Frame Banner
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mb-2.5">
                  Upload the full banner image that will fill the top hero frame of this category page.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingCategory(prev => ({ ...prev, bannerImage: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border border-zinc-200 bg-white rounded-xl px-3 py-2 text-xs"
                />
                {editingCategory.bannerImage && (
                  <div className="mt-3 relative inline-block bg-zinc-900 p-2 rounded-xl w-full">
                    <img src={editingCategory.bannerImage} alt="Banner" className="max-h-36 w-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setEditingCategory(prev => ({ ...prev, bannerImage: null }))}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold cursor-pointer shadow"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-black text-zinc-900 mb-5">Edit Product</h3>
            <form onSubmit={handleSaveEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Category</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm bg-white"
                >
                  <optgroup label="📱 1. Phone Cover">
                    {categories
                      .filter(c => normalizeCategorySection(c) === 'phone_cover')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                  </optgroup>
                  <optgroup label="🛡️ 2. Phone Temper Glass">
                    {categories
                      .filter(c => normalizeCategorySection(c) === 'temper_glass')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                  </optgroup>
                  <optgroup label="💻 3. Phone & Laptop Skin">
                    {categories
                      .filter(c => normalizeCategorySection(c) === 'laptop_skin')
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Old Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: Number(e.target.value) })}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    value={editingProduct.off}
                    onChange={(e) => setEditingProduct({ ...editingProduct, off: e.target.value })}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Change Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingProduct(prev => ({ ...prev, image: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-xs"
                />
                {editingProduct.image && (
                  <div className="mt-2">
                    <img src={editingProduct.image} alt="Thumb" className="w-20 h-24 object-contain rounded-xl border p-1" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STORY MODAL */}
      {editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              type="button"
              onClick={() => setEditingStory(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-black text-zinc-900 mb-5">Edit Story Section</h3>
            <form onSubmit={handleSaveEditStory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Story Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 text-sm"
                  value={editingStory.name}
                  onChange={e => setEditingStory({...editingStory, name: e.target.value})}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-zinc-700">
                    Slides ({editingStory.images.length})
                  </label>
                  <label className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Images
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleEditStoryImagesAdd} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2.5 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                  {editingStory.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 group">
                      <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {idx === 0 ? 'Cover' : `#${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingStory(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow hover:bg-rose-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REVIEW MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              type="button"
              onClick={() => setEditingReview(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 p-1 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-black text-zinc-900 mb-5">Edit Customer Review</h3>
            <form onSubmit={handleSaveEditReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                    value={editingReview.author}
                    onChange={e => setEditingReview({...editingReview, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Rating</label>
                  <select 
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm bg-white"
                    value={editingReview.rating}
                    onChange={e => setEditingReview({...editingReview, rating: parseInt(e.target.value)})}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Review Title</label>
                <input 
                  type="text" 
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  value={editingReview.title}
                  onChange={e => setEditingReview({...editingReview, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Review Text</label>
                <textarea 
                  rows={3} 
                  required
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  value={editingReview.text}
                  onChange={e => setEditingReview({...editingReview, text: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 text-sm"
                  value={editingReview.product}
                  onChange={e => setEditingReview({...editingReview, product: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDERS SECTION ================= */}
      {mainSection === 'orders' && (() => {
        // Filter orders by tab and search query
        const q = (orderSearchQuery || '').toLowerCase().trim();
        const tabFiltered = orders.filter(o => 
          orderFilter === 'all' ? true : (orderFilter === 'paid' ? o.isPaid : !o.isPaid)
        );
        const filteredOrders = tabFiltered.filter(o => {
          if (!q) return true;
          const id = (o.orderId || '').toLowerCase();
          const name = `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase();
          const phone = `${o.customer?.phone || ''} ${o.customer?.altPhone || ''}`.toLowerCase();
          const city = `${o.customer?.city || ''} ${o.customer?.state || ''}`.toLowerCase();
          return id.includes(q) || name.includes(q) || phone.includes(q) || city.includes(q);
        });

        const pendingCount = orders.filter(o => !o.isPaid).length;
        const paidCount = orders.filter(o => o.isPaid).length;

        return (
          <div className="space-y-6">
            {/* Header with Title and Search/Filters */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-200 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">Customer Orders</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">
                    {orders.length} Total
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Click on any order in the list to view complete customer and product details
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search Order ID, name, phone..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg shrink-0">
                  <button 
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      orderFilter === 'all' ? 'bg-white shadow-xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button 
                    onClick={() => setOrderFilter('pending')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      orderFilter === 'pending' ? 'bg-white shadow-xs text-amber-700' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button 
                    onClick={() => setOrderFilter('paid')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      orderFilter === 'paid' ? 'bg-white shadow-xs text-emerald-700' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    Paid ({paidCount})
                  </button>
                </div>
              </div>
            </div>

            {/* ORDERS TABLE / LIST VIEW */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-800">
                  {orderSearchQuery ? 'No orders match your search' : (orderFilter === 'all' ? 'No orders placed yet' : `No ${orderFilter} orders found`)}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  New orders will automatically appear here with live notifications
                </p>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-xs">
                {/* Desktop Table Header */}
                {/* Desktop Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-3 px-6 py-3.5 bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-black uppercase tracking-wider text-zinc-500 select-none items-center">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-2">Items</div>
                  <div className="col-span-1 text-center">Total</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* List Rows */}
                <div className="divide-y divide-zinc-100">
                  {filteredOrders.map((order, idx) => {
                    const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                    const firstItem = Array.isArray(order.items) && order.items[0];
                    const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Guest Customer';

                    return (
                      <div
                        key={order.orderId || idx}
                        onClick={() => setSelectedOrder(order)}
                        className="group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-3 p-4 lg:px-6 lg:py-3.5 items-stretch lg:items-center hover:bg-amber-50/40 transition-colors cursor-pointer"
                      >
                        {/* 1. Order ID & Status (Mobile Header / Desktop Col 1) */}
                        <div className="col-span-2 flex items-center justify-between lg:justify-start gap-2">
                          <span className="font-mono font-black text-sm text-zinc-950 group-hover:text-[#ea580c] transition-colors">
                            {order.orderId}
                          </span>
                          {/* Mobile status pill */}
                          <span className={`lg:hidden px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                            order.isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                            {order.isPaid ? 'PAID' : 'PENDING'}
                          </span>
                        </div>

                        {/* 2. Customer */}
                        <div className="col-span-3 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                            {customerName}
                          </p>
                          <p className="text-xs text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                            {order.customer?.phone || 'No phone'}
                          </p>
                        </div>

                        {/* 3. Date */}
                        <div className="col-span-1 text-xs text-zinc-500 font-medium truncate">
                          <span>{order.date || 'Recent'}</span>
                        </div>

                        {/* 4. Items Preview */}
                        <div className="col-span-2 flex items-center gap-2 min-w-0">
                          {firstItem?.image && (
                            <img
                              src={firstItem.image}
                              alt=""
                              className="w-7 h-9 object-contain rounded bg-zinc-100 p-0.5 shrink-0 border border-zinc-200/60"
                            />
                          )}
                          <div className="text-xs text-zinc-600 min-w-0 truncate">
                            <span className="font-semibold text-zinc-800">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </span>
                            {firstItem?.title && (
                              <p className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                                {firstItem.title}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* 5. Total */}
                        <div className="col-span-1 text-left lg:text-center font-black text-sm text-zinc-950 whitespace-nowrap">
                          ₹{order.total}
                        </div>

                        {/* 6. Desktop Status Badge */}
                        <div className="col-span-1 hidden lg:flex items-center justify-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            order.isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                            {order.isPaid ? 'PAID' : 'PENDING'}
                          </span>
                        </div>

                        {/* 7. Actions */}
                        <div className="col-span-2 flex items-center justify-between lg:justify-end gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOrderStatus(order.orderId, order.isPaid);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              order.isPaid
                                ? 'text-amber-700 hover:bg-amber-100'
                                : 'text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={order.isPaid ? 'Mark as Pending' : 'Mark as Completed / Paid'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOrder(order.orderId);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= FULL ORDER DETAILS MODAL ================= */}
            {selectedOrder && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setSelectedOrder(null)}
              >
                <div
                  className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-zinc-200 animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-lg sm:text-xl text-zinc-950">
                          {selectedOrder.orderId}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          selectedOrder.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${selectedOrder.isPaid ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                          {selectedOrder.isPaid ? 'PAYMENT COMPLETED' : 'PAYMENT PENDING'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-medium mt-1">
                        Placed on {selectedOrder.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
                        title="Print Order Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                    {/* Top 2 Cards: Customer Information & Payment Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Customer Details Card */}
                      <div className="bg-zinc-50/80 rounded-2xl p-4 sm:p-5 border border-zinc-200/80">
                        <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#ea580c]" /> Customer Details
                        </h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div>
                            <span className="text-zinc-500 text-[11px] font-bold uppercase block">Customer Name</span>
                            <span className="font-extrabold text-zinc-900 text-sm sm:text-base">
                              {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[11px] font-bold uppercase block">Phone Number</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={`tel:${selectedOrder.customer?.phone}`}
                                className="font-bold text-zinc-900 hover:text-[#ea580c] underline"
                              >
                                {selectedOrder.customer?.phone}
                              </a>
                              {selectedOrder.customer?.phone && (
                                <a
                                  href={`https://wa.me/91${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded-md"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                            {selectedOrder.customer?.altPhone && (
                              <p className="text-xs text-zinc-500 mt-0.5">Alt: {selectedOrder.customer.altPhone}</p>
                            )}
                          </div>
                          <div>
                            <span className="text-zinc-500 text-[11px] font-bold uppercase block">Delivery Address</span>
                            <p className="font-medium text-zinc-800 mt-0.5 leading-relaxed flex items-start gap-1.5">
                              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                              <span>
                                {selectedOrder.customer?.address}
                                {selectedOrder.customer?.apartment && `, ${selectedOrder.customer.apartment}`}
                                <br />
                                {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - <strong>{selectedOrder.customer?.pincode}</strong>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment & Order Summary Card */}
                      <div className="bg-zinc-50/80 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#ea580c]" /> Payment & Order Summary
                          </h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between py-1 border-b border-zinc-200/60">
                              <span className="text-zinc-500">Order Placed:</span>
                              <span className="font-semibold text-zinc-800">{selectedOrder.date}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-zinc-200/60">
                              <span className="text-zinc-500">Shipping:</span>
                              <span className="font-bold text-emerald-600">{selectedOrder.shipping || 'Free'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-zinc-200/60">
                              <span className="text-zinc-500">Total Items:</span>
                              <span className="font-bold text-zinc-900">
                                {Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0} items
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-zinc-200/60">
                              <span className="text-zinc-500">Status:</span>
                              <span className={`font-bold ${selectedOrder.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {selectedOrder.isPaid ? 'Paid' : 'Pending Payment'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-zinc-200 flex justify-between items-center">
                          <span className="font-bold text-zinc-700">Total Amount:</span>
                          <span className="font-black text-xl text-zinc-950">
                            INR ₹{selectedOrder.total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <PackagePlus className="w-4 h-4 text-[#ea580c]" />
                        Ordered Items ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
                      </h4>

                      <div className="space-y-3">
                        {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, i) => (
                          <div 
                            key={i} 
                            className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs"
                          >
                            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-zinc-100">
                              <img
                                src={item?.image}
                                alt={item?.title}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="text-sm sm:text-base font-extrabold text-zinc-950">
                                  {item?.title || 'Custom Product'}
                                </h5>
                                <span className="font-black text-sm text-zinc-950 shrink-0">
                                  ₹{(Number(item?.price) || 0) * (Number(item?.quantity) || 1)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                <p>
                                  <span className="font-bold text-zinc-700">Phone Model:</span>{' '}
                                  <span className="font-extrabold text-zinc-900">{item?.model || item?.phoneModel || 'N/A'}</span>
                                </p>
                                <p>
                                  <span className="font-bold text-zinc-700">Qty × Price:</span>{' '}
                                  <span>{item?.quantity || 1} × ₹{item?.price || 0}</span>
                                </p>
                                {item?.customName && (
                                  <p className="col-span-1 sm:col-span-2">
                                    <span className="font-bold text-zinc-700">Custom Name:</span>{' '}
                                    <span className="bg-amber-100 text-[#ea580c] px-2 py-0.5 rounded font-bold">{item.customName}</span>
                                  </p>
                                )}
                                {item?.wording && (
                                  <p className="col-span-1 sm:col-span-2">
                                    <span className="font-bold text-zinc-700">Custom Wording:</span>{' '}
                                    <span className="bg-amber-100 text-[#ea580c] px-2 py-0.5 rounded font-bold">{item.wording}</span>
                                  </p>
                                )}
                                {item?.customPhoto && (
                                  <div className="col-span-1 sm:col-span-2 flex items-center gap-2 mt-1">
                                    <span className="font-bold text-zinc-700">Custom Photo:</span>
                                    <a
                                      href={item.customPhoto}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      View Uploaded Photo &rarr;
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => deleteOrder(selectedOrder.orderId)}
                      className="px-4 py-2 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Order
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleOrderStatus(selectedOrder.orderId, selectedOrder.isPaid)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedOrder.isPaid
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {selectedOrder.isPaid ? 'Mark as Pending' : '✓ Mark as Paid / Completed'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
