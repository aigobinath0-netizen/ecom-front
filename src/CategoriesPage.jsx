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
  onSelectCategory,
  onSelectProduct,
  setCurrentPage
}) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // 'phone_cover', 'temper_glass', 'laptop_skin', 'all'
  const [activeSectionId, setActiveSectionId] = useState('phone_cover');
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
  const activeProducts = products.filter(p => activeCategoryIds.has(p.categoryId));

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else if (setCurrentPage) {
      setCurrentPage('collection');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP GOLDEN BANNER (MATCHING ZAPVI STYLE) */}
      <div className="bg-[#f59e0b] text-zinc-950 text-xs sm:text-[13px] font-black py-2 px-4 text-center tracking-wide uppercase shadow-inner">
        Your Design. Your Style. Your Pravar.
      </div>

      {/* Main Split-View Container */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row">
        
        {/* 2. LEFT SIDEBAR NAVIGATION RAIL (MATCHING ZAPVI SCREENSHOT) */}
        <aside className="w-full md:w-36 lg:w-44 shrink-0 bg-white border-b md:border-b-0 md:border-r border-zinc-200/80 sticky top-[68px] z-20 self-start">
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto py-2 md:py-4 scrollbar-none">
            
            {/* Tab: Popular / All */}
            <button
              onClick={() => setActiveSectionId('all')}
              className={`relative flex flex-col items-center justify-center p-3 sm:p-4 min-w-[90px] md:min-w-0 transition-all cursor-pointer ${
                activeSectionId === 'all'
                  ? 'bg-amber-50/50 md:bg-transparent text-[#ea580c]'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {/* Active Orange Bar (Left edge on desktop, bottom edge on mobile) */}
              {activeSectionId === 'all' && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ea580c] hidden md:block rounded-r" />
              )}
              {activeSectionId === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ea580c] md:hidden" />
              )}

              {/* Circular Icon */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 overflow-hidden transition-transform duration-300 ${
                activeSectionId === 'all'
                  ? 'ring-2 ring-[#ea580c] scale-105 shadow-md bg-white'
                  : 'border border-zinc-200 bg-[#f4f4f6]'
              }`}>
                <img
                  src="/images/logo-mark-ayXhBs9R.png"
                  alt="Popular"
                  className="w-full h-full object-cover rounded-full mix-blend-multiply"
                />
              </div>
              <span className={`text-[11px] sm:text-xs uppercase tracking-wider mt-2 font-bold text-center leading-tight ${
                activeSectionId === 'all' ? 'text-[#ea580c] font-black' : 'text-zinc-700'
              }`}>
                Popular
              </span>
            </button>

            {/* 3 Main Sections Defined by User */}
            {CATEGORY_SECTIONS.map((sec, idx) => {
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 min-w-[100px] md:min-w-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50/50 md:bg-transparent text-[#ea580c]'
                      : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ea580c] hidden md:block rounded-r" />
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ea580c] md:hidden" />
                  )}

                  {/* Circular Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 overflow-hidden transition-transform duration-300 ${
                    isActive
                      ? 'ring-2 ring-[#ea580c] scale-105 shadow-md bg-white'
                      : 'border border-zinc-200 bg-[#f4f4f6]'
                  }`}>
                    <img
                      src={sec.icon}
                      alt={sec.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Label */}
                  <span className={`text-[11px] sm:text-xs uppercase tracking-wider mt-2 font-bold text-center leading-tight line-clamp-2 px-1 ${
                    isActive ? 'text-[#ea580c] font-black' : 'text-zinc-700'
                  }`}>
                    {sec.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 3. RIGHT CONTENT AREA (ZAPVI CIRCULAR CATEGORIES & PRODUCTS) */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 min-w-0">
          
          {/* Search Bar inside Categories */}
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories (e.g. Clear, Glass, Skin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f4f4f6] border border-zinc-200/80 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-zinc-900 focus:bg-white transition-all shadow-xs"
              />
            </div>
          </div>

          {/* VIEW: Popular / All Sections */}
          {activeSectionId === 'all' && (
            <div className="space-y-12">
              
              {/* TOP PICKS / 1. PHONE COVER */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xs sm:text-sm font-black tracking-widest text-zinc-400 uppercase">
                      TOP PICKS • PHONE COVER
                    </h2>
                    <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 mt-0.5">
                      Customized Phone Cases & Covers
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('phone_cover')}
                    className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Section <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7">
                  {coverCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-2.5 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[120px] transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. PHONE TEMPER GLASS */}
              <section className="pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xs sm:text-sm font-black tracking-widest text-zinc-400 uppercase">
                      SHOP BY CATEGORY • PHONE TEMPER GLASS
                    </h2>
                    <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 mt-0.5">
                      9H Strong Screen & Lens Protectors
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('temper_glass')}
                    className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Section <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7">
                  {glassCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-2.5 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[120px] transition-colors">
                        {cat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. PHONE AND LAPTOP SKIN */}
              <section className="pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xs sm:text-sm font-black tracking-widest text-zinc-400 uppercase">
                      SHOP BY CATEGORY • PHONE & LAPTOP SKIN
                    </h2>
                    <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 mt-0.5">
                      Textured Wraps & Precision Skins
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionId('laptop_skin')}
                    className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Section <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7">
                  {skinCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-1 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="mt-2.5 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[120px] transition-colors">
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
              {/* Header */}
              <div className="mb-8 pb-4 border-b border-zinc-100">
                <span className="text-[11px] font-black tracking-widest text-[#ea580c] uppercase bg-amber-50 px-2.5 py-1 rounded-md">
                  Section #{activeSectionId === 'phone_cover' ? '1' : activeSectionId === 'temper_glass' ? '2' : '3'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black mt-2 tracking-tight">
                  {CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.name}
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                  {CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.subtitle}
                </p>
              </div>

              {/* Category Circles Grid */}
              <div className="mb-14">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
                  EXPLORE {CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.name} CATEGORIES
                </h2>

                {activeCategories.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-7">
                    {activeCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className="group flex flex-col items-center cursor-pointer select-none"
                      >
                        {/* Circular Zapvi Card */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 p-1 flex items-center justify-center">
                          <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover rounded-full"
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h4 className="mt-2.5 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[120px] transition-colors">
                          {cat.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-6 border-2 border-dashed border-zinc-200 rounded-2xl text-center">
                    <p className="text-zinc-500 font-semibold text-sm">
                      No categories added in this section yet.
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      You can add new categories anytime from the Admin panel!
                    </p>
                  </div>
                )}
              </div>

              {/* Products in this Section */}
              {activeProducts.length > 0 && (
                <div className="pt-8 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 uppercase tracking-tight">
                        Featured In {CATEGORY_SECTIONS.find(s => s.id === activeSectionId)?.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Top trending products available for custom order
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {activeProducts.map((prod, idx) => (
                      <div
                        key={prod.id}
                        onClick={() => onSelectProduct && onSelectProduct(prod)}
                        className="group flex flex-col cursor-pointer"
                      >
                        <div className="relative bg-[#f4f4f5] rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center p-3">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="pt-2.5 text-center">
                          <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-black line-clamp-1">
                            {prod.title}
                          </h4>
                          <div className="flex items-center justify-center gap-1 mt-0.5 text-[#f59e0b] text-[11px]">
                            <span>★★★★★</span>
                            <span className="text-zinc-400 font-normal">(24)</span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-zinc-950 mt-1">
                            Rs. {prod.price}.00
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
