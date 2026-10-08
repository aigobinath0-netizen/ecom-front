import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { 
  getStoredCategories, 
  getStoredProducts, 
  fetchCategoriesFromApi, 
  fetchProductsFromApi 
} from './categoryData';

export default function Collection({ 
  selectedCategory, 
  setSelectedCategory, 
  setCurrentPage, 
  onSelectProduct 
}) {
  const [categories, setCategories] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. Initial cached state
    const cachedCats = getStoredCategories();
    setCategories(cachedCats);

    let active = null;
    if (selectedCategory) {
      active = cachedCats.find(c => c.id === selectedCategory.id || c.slug === selectedCategory.slug) || selectedCategory;
    } else if (cachedCats.length > 0) {
      active = cachedCats[0];
    }
    setCurrentCat(active);

    if (active) {
      setProducts(getStoredProducts(active.id));
    } else {
      setProducts(getStoredProducts());
    }

    // 2. Live fetch from backend API
    const loadLive = async () => {
      try {
        const liveCats = await fetchCategoriesFromApi();
        if (Array.isArray(liveCats) && liveCats.length > 0) {
          setCategories(liveCats);
          let liveActive = null;
          if (selectedCategory) {
            liveActive = liveCats.find(c => c.id === selectedCategory.id || c.slug === selectedCategory.slug) || selectedCategory;
          } else if (active) {
            liveActive = liveCats.find(c => c.id === active.id) || liveCats[0];
          } else {
            liveActive = liveCats[0];
          }
          setCurrentCat(liveActive);

          if (liveActive) {
            const liveProds = await fetchProductsFromApi(liveActive.id);
            if (Array.isArray(liveProds)) setProducts(liveProds);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadLive();
  }, [selectedCategory]);

  const handleSelectCategory = (cat) => {
    setCurrentCat(cat);
    if (setSelectedCategory) setSelectedCategory(cat);
    setProducts(getStoredProducts(cat.id));
    // Also fetch live products
    fetchProductsFromApi(cat.id).then(prods => {
      if (Array.isArray(prods)) setProducts(prods);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-20 w-full pt-8 sm:pt-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6">
            <button 
              onClick={() => setCurrentPage && setCurrentPage('home')}
              className="hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="text-zinc-400">Collections</span>
          </div>

          <div className="text-center py-20 px-4 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-14 h-14 bg-zinc-100 text-zinc-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-2">Collections Coming Soon</h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6">
              We are currently preparing exciting collections. Please check back shortly!
            </p>
            <button 
              onClick={() => setCurrentPage && setCurrentPage('home')}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Category Header */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-20 w-full pt-8 sm:pt-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-4 sm:mb-6">
          <button 
            onClick={() => setCurrentPage && setCurrentPage('home')}
            className="hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-400">Collections</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-900 font-bold">{currentCat?.title}</span>
        </div>

        {/* Category Hero Frame / Banner (Tight wrap matching exact 1600x800 / 2:1 pixel aspect ratio with no outside gaps) */}
        {(currentCat?.bannerImage || currentCat?.image) && (
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10 shadow-2xl border border-zinc-200/80">
            {/* Exactly fits 1600x800 image without borders extending outside or cropping */}
            <img 
              src={currentCat.bannerImage || currentCat.image} 
              alt={currentCat.title} 
              className="w-full h-auto aspect-[2/1] object-cover block" 
            />
          </div>
        )}

        {/* Category Title & Product Count */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            {currentCat?.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Showing {products.length} premium mobile cases & covers
          </p>
        </div>

        {/* Horizontal Category Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-zinc-100 mb-8">
          {categories.map((cat) => {
            const isSelected = currentCat?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Product Grid - Customer View */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                className="group bg-white border border-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative bg-zinc-50/60 aspect-[3/4] p-4 flex items-center justify-center overflow-hidden">
                  {/* SALE Badge */}
                  <span className="absolute top-2.5 left-2.5 z-10 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                    {prod.badge || 'SALE'}
                  </span>

                  <img 
                    alt={prod.title} 
                    src={prod.image} 
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300 mix-blend-multiply" 
                  />
                </div>

                {/* Details Section */}
                <div className="p-3.5 sm:p-4 text-center flex flex-col flex-1 justify-between">
                  <h3 className="text-xs sm:text-sm text-zinc-900 font-bold break-words line-clamp-2 min-h-[36px] group-hover:text-amber-600 transition-colors">
                    {prod.title}
                  </h3>
                  
                  <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-2 pt-1 border-t border-zinc-50">
                    <span className="text-zinc-950 font-black text-sm sm:text-base">
                      ₹{prod.price}
                    </span>
                    {prod.oldPrice && (
                      <span className="text-zinc-400 text-[11px] sm:text-xs line-through font-medium">
                        ₹{prod.oldPrice}
                      </span>
                    )}
                    {prod.off && (
                      <span className="text-green-600 text-[11px] sm:text-xs font-bold">
                        {prod.off}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-200/80 px-4">
            <div className="w-14 h-14 bg-zinc-100 text-zinc-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              New Designs Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6">
              We are adding exciting new cases for "{currentCat?.title}". Check back soon or explore our other collections!
            </p>
            <button
              onClick={() => setCurrentPage && setCurrentPage('home')}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Explore Other Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
