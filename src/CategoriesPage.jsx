import React, { useState, useEffect } from 'react';
import {
  CATEGORY_SECTIONS,
  getStoredCategories,
  getStoredProducts,
  fetchCategoriesFromApi,
  fetchProductsFromApi,
  normalizeCategorySection
} from './categoryData';
import { Search, ChevronRight, ShieldCheck, Star, Sparkles, ArrowRight } from 'lucide-react';

export default function CategoriesPage({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  setCurrentPage
}) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // 'phone_cover', 'temper_glass', 'laptop_skin', 'all'
  const [activeSectionId, setActiveSectionId] = useState('phone_cover');
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Initial cached data
    setCategories(getStoredCategories());
    setProducts(getStoredProducts());

    // 2. Fetch live data
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
    fetchProductsFromApi().then(prods => {
      if (Array.isArray(prods)) setProducts(prods);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const sec = selectedCategory.section || normalizeCategorySection(selectedCategory);
      setActiveSectionId(sec);
      setSelectedCat(selectedCategory);
    } else if (selectedCategory === 'all') {
      setActiveSectionId('all');
      setSelectedCat(null);
    }
  }, [selectedCategory]);

  const allWithSections = categories.map(c => ({
    ...c,
    section: normalizeCategorySection(c)
  }));

  // Filter categories by search query
  const filteredCategories = allWithSections.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group categories into the 3 user-specified sections
  const coverCategories = filteredCategories.filter(c => c.section === 'phone_cover');
  const glassCategories = filteredCategories.filter(c => c.section === 'temper_glass');
  const skinCategories = filteredCategories.filter(c => c.section === 'laptop_skin');

  // Filter products for the active section
  const activeCategories = 
    activeSectionId === 'phone_cover' ? coverCategories :
    activeSectionId === 'temper_glass' ? glassCategories :
    activeSectionId === 'laptop_skin' ? skinCategories :
    filteredCategories;

  const activeCategoryIds = new Set(activeCategories.map(c => c.id));
  const sectionProducts = products.filter(p => activeCategoryIds.has(p.categoryId));
  const displayedProducts = selectedCat
    ? products.filter(p => p.categoryId === selectedCat.id)
    : sectionProducts;

  const handleCategoryClick = (cat) => {
    setSelectedCat(cat);
    if (cat.section && cat.section !== activeSectionId) {
      setActiveSectionId(cat.section);
    }
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setTimeout(() => {
      const el = document.getElementById('category-products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP GOLDEN BANNER (MATCHING ZAPVI STYLE) */}
      <div className="bg-[#f59e0b] text-zinc-950 text-xs sm:text-[13px] font-black py-2 px-4 text-center tracking-wide uppercase shadow-inner">
        Your Design. Your Style. Your Pravar.
      </div>

      {/* Main Split-View Container: ALWAYS flex-row (vertical sidebar on left + content on right) both on mobile and desktop! */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-row min-h-[calc(100vh-120px)]">
        
        {/* 2. LEFT SIDEBAR NAVIGATION RAIL (MATCHING ZAPVI MOBILE & DESKTOP SCREENSHOT) */}
        <aside className="w-[82px] sm:w-24 md:w-36 lg:w-44 shrink-0 bg-white border-r border-zinc-200/80 sticky top-[68px] z-20 self-start h-[calc(100vh-68px)] overflow-y-auto scrollbar-none py-2.5 sm:py-4">
          <div className="flex flex-col gap-1 sm:gap-2">
            
            {/* Tab: Popular / All */}
            <button
              onClick={() => {
                setActiveSectionId('all');
                setSelectedCat(null);
              }}
              className={`relative w-full flex flex-col items-center justify-center py-2.5 px-1 sm:p-3 transition-all cursor-pointer ${
                activeSectionId === 'all'
                  ? 'bg-amber-50/50 md:bg-transparent text-[#ea580c]'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {/* Active Orange Bar on Left Edge */}
              {activeSectionId === 'all' && (
                <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 bg-[#ea580c] rounded-r" />
              )}

              {/* Circular Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0.5 sm:p-1 overflow-hidden transition-transform duration-300 ${
                activeSectionId === 'all'
                  ? 'ring-2 ring-[#ea580c] scale-105 shadow-xs bg-white'
                  : 'border border-zinc-200 bg-[#f4f4f6]'
              }`}>
                <img
                  src="/images/logo-mark-ayXhBs9R.png"
                  alt="Popular"
                  className="w-full h-full object-cover rounded-full mix-blend-multiply"
                />
              </div>
              <span className={`text-[10px] sm:text-xs tracking-tight mt-1 sm:mt-1.5 font-bold text-center leading-tight line-clamp-2 px-0.5 ${
                activeSectionId === 'all' ? 'text-[#ea580c] font-black' : 'text-zinc-700'
              }`}>
                Popular
              </span>
            </button>

            {/* 3 Main Sections Defined by User */}
            {CATEGORY_SECTIONS.map((sec) => {
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setSelectedCat(null);
                  }}
                  className={`relative w-full flex flex-col items-center justify-center py-2.5 px-1 sm:p-3 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50/50 md:bg-transparent text-[#ea580c]'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                  }`}
                >
                  {/* Active Indicator Bar on Left Edge */}
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 bg-[#ea580c] rounded-r" />
                  )}

                  {/* Circular Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0.5 sm:p-1 overflow-hidden transition-transform duration-300 ${
                    isActive
                      ? 'ring-2 ring-[#ea580c] scale-105 shadow-xs bg-white'
                      : 'border border-zinc-200 bg-[#f4f4f6]'
                  }`}>
                    <img
                      src={sec.icon}
                      alt={sec.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Label */}
                  <span className={`text-[10px] sm:text-xs tracking-tight mt-1 sm:mt-1.5 font-bold text-center leading-tight line-clamp-2 px-0.5 ${
                    isActive ? 'text-[#ea580c] font-black' : 'text-zinc-700'
                  }`}>
                    {sec.shortName || sec.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 3. RIGHT CONTENT AREA (ZAPVI CIRCULAR CATEGORIES & PRODUCTS) */}
        <main className="flex-1 p-2.5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 sm:pb-16">
          
          {/* Search Bar inside Categories */}
          <div className="mb-4 sm:mb-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f4f4f6] border border-zinc-200/80 rounded-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none focus:border-zinc-900 focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          {/* VIEW: Popular / All Sections */}
          {activeSectionId === 'all' && (
            <div className="space-y-8 sm:space-y-12">
              
              {/* TOP PICKS / 1. PHONE COVER */}
              <section>
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div>
                    <h2 className="text-[10px] sm:text-xs font-black tracking-widest text-zinc-400 uppercase">
                      READY DESIGNS • PHONE COVER
                    </h2>
                    <h3 className="text-sm sm:text-lg font-extrabold text-zinc-950 mt-0.5">
                      Trendy Cases & Covers
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('phone_cover')}
                    className="text-[11px] sm:text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-3.5 sm:gap-4 md:gap-6">
                  {coverCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-1.5 text-center text-[10px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. PHONE TEMPER GLASS */}
              <section className="pt-5 sm:pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div>
                    <h2 className="text-[10px] sm:text-xs font-black tracking-widest text-zinc-400 uppercase">
                      SCREEN & LENS PROTECTORS
                    </h2>
                    <h3 className="text-sm sm:text-lg font-extrabold text-zinc-950 mt-0.5">
                      9H Strong Temper Glass
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('temper_glass')}
                    className="text-[11px] sm:text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-3.5 sm:gap-4 md:gap-6">
                  {glassCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-1.5 text-center text-[10px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. PHONE AND LAPTOP SKIN */}
              <section className="pt-5 sm:pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div>
                    <h2 className="text-[10px] sm:text-xs font-black tracking-widest text-zinc-400 uppercase">
                      PHONE & LAPTOP SKIN
                    </h2>
                    <h3 className="text-sm sm:text-lg font-extrabold text-zinc-950 mt-0.5">
                      Textured Wraps & Skins
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('laptop_skin')}
                    className="text-[11px] sm:text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-3.5 sm:gap-4 md:gap-6">
                  {skinCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-1.5 text-center text-[10px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* VIEW: Single Selected Section (Phone Cover, Temper Glass, or Laptop Skin) */}
          {activeSectionId !== 'all' && (
            <div>
              {/* Header (Matching Zapvi: READY DESIGNS AND TRENDY CASE) */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-700">
                  {activeSectionId === 'phone_cover'
                    ? 'READY DESIGNS AND TRENDY CASE'
                    : activeSectionId === 'temper_glass'
                    ? 'STRONG 9H SCREEN & LENS PROTECTORS'
                    : 'TEXTURED WRAPS & PRECISION SKINS'}
                </h2>
                <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 hidden sm:block">
                  {CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.subtitle}
                </p>
              </div>

              {/* Category Circles 3-Column Grid on Mobile */}
              <div className="mb-10 sm:mb-14">
                {activeCategories.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-3.5 sm:gap-4 md:gap-6">
                    {activeCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className="group flex flex-col items-center cursor-pointer select-none"
                      >
                        {/* Circular Zapvi Card */}
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-[#f4f4f6] border shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center ${
                          selectedCat?.id === cat.id ? 'ring-2 ring-[#ea580c] border-[#ea580c]' : 'border-zinc-200/80'
                        }`}>
                          <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover rounded-full"
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h4 className="mt-1.5 text-center text-[10px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
                          {cat.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 px-4 border-2 border-dashed border-zinc-200 rounded-2xl text-center">
                    <p className="text-zinc-500 font-semibold text-xs sm:text-sm">
                      No categories added in this section yet.
                    </p>
                    <p className="text-zinc-400 text-[11px] mt-1">
                      You can add new categories anytime from the Admin panel!
                    </p>
                  </div>
                )}
              </div>

              {/* Products in this Section or Selected Category */}
              <div className="pt-6 sm:pt-8 border-t border-zinc-100" id="category-products-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                  <div>
                    {selectedCat ? (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-100 text-[#ea580c] px-2 py-0.5 rounded-full">
                          Category: {selectedCat.title}
                        </span>
                        <button
                          onClick={() => setSelectedCat(null)}
                          className="text-[11px] sm:text-xs font-semibold text-zinc-500 hover:text-black underline cursor-pointer"
                        >
                          Show all
                        </button>
                      </div>
                    ) : null}
                    <h3 className="text-sm sm:text-lg font-extrabold text-zinc-950 uppercase tracking-tight">
                      {selectedCat ? `${selectedCat.title} Products` : `Featured In ${CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.name}`}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
                      {displayedProducts.length > 0
                        ? `${displayedProducts.length} products available for custom order`
                        : 'No products in this category yet'}
                    </p>
                  </div>
                </div>

                {displayedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-5">
                    {displayedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => onSelectProduct && onSelectProduct(prod)}
                        className="group flex flex-col cursor-pointer bg-white p-2 sm:p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-300 transition-all shadow-2xs"
                      >
                        <div className="relative bg-[#f4f4f5] rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center p-2.5">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="pt-2 text-center">
                          <h4 className="text-[11px] sm:text-sm font-semibold text-zinc-900 group-hover:text-black line-clamp-1">
                            {prod.title}
                          </h4>
                          <div className="flex items-center justify-center gap-1 mt-0.5 text-[#f59e0b] text-[10px]">
                            <span>★★★★★</span>
                            <span className="text-zinc-400 font-normal">(24)</span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-zinc-950 mt-0.5">
                            Rs. {prod.price}.00
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 px-4 border border-dashed border-zinc-200 rounded-xl text-center">
                    <p className="text-xs sm:text-sm text-zinc-500">
                      No products added for {selectedCat ? `"${selectedCat.title}"` : 'this section'} yet.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
