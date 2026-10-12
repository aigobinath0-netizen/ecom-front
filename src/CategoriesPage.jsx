import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CATEGORY_SECTIONS,
  getStoredCategories,
  getStoredProducts,
  fetchCategoriesFromApi,
  fetchProductsFromApi,
  normalizeCategorySection
} from './categoryData';
import { Search, ArrowLeft } from 'lucide-react';

export default function CategoriesPage({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  setCurrentPage
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // 'phone_cover', 'temper_glass', 'laptop_skin', 'all'
  const [activeSectionId, setActiveSectionId] = useState('phone_cover');
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Initial cached data
    const cachedCats = getStoredCategories();
    const cachedProds = getStoredProducts();
    setCategories(cachedCats);
    setProducts(cachedProds);

    // 2. Fetch live data
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
    fetchProductsFromApi().then(prods => {
      if (Array.isArray(prods)) setProducts(prods);
    });
  }, []);

  // Sync selectedCategory from props
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const sec = selectedCategory.section || normalizeCategorySection(selectedCategory);
      setActiveSectionId(sec);
      setSelectedCat(selectedCategory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (selectedCategory === 'all') {
      setActiveSectionId('all');
      setSelectedCat(null);
    }
  }, [selectedCategory]);

  // Sync from URL slug if navigated via /collections/:slug or /category/:slug
  useEffect(() => {
    if (slug && categories.length > 0) {
      const cleanSlug = slug.toLowerCase();
      const found = categories.find(c =>
        (c.slug && c.slug.toLowerCase() === cleanSlug) ||
        (c.id && c.id.toLowerCase() === cleanSlug) ||
        (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug) ||
        (c.title && c.title.toLowerCase().replace(/\s+/g, '') === cleanSlug.replace(/-/g, ''))
      );
      if (found) {
        setSelectedCat(found);
        setActiveSectionId(found.section || normalizeCategorySection(found));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [slug, categories]);

  const allWithSections = categories.map(c => ({
    ...c,
    section: normalizeCategorySection(c)
  }));

  // Filter categories by search query
  const filteredCategories = allWithSections.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group categories into sections
  const coverCategories = filteredCategories.filter(c => c.section === 'phone_cover');
  const glassCategories = filteredCategories.filter(c => c.section === 'temper_glass');
  const skinCategories = filteredCategories.filter(c => c.section === 'laptop_skin');

  const activeCategories =
    activeSectionId === 'phone_cover' ? coverCategories :
      activeSectionId === 'temper_glass' ? glassCategories :
        activeSectionId === 'laptop_skin' ? skinCategories :
          filteredCategories;

  const displayCategories = activeCategories.length > 0 ? activeCategories : allWithSections;
  const currentSection = CATEGORY_SECTIONS.find(s => s.id === activeSectionId) || CATEGORY_SECTIONS[0];

  const handleCategoryClick = (cat) => {
    setSelectedCat(cat);
    if (cat.section && cat.section !== activeSectionId) {
      setActiveSectionId(cat.section);
    }
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const catSlug = cat.slug || cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/collections/${catSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCat(null);
    if (onSelectCategory) onSelectCategory(null);
    navigate('/categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Products belonging to the selected category (matching Image 2)
  const rawCatProducts = selectedCat
    ? products.filter(p => p.categoryId === selectedCat.id || p.categoryTitle === selectedCat.title)
    : [];

  const selectedCatProducts = selectedCat ? (
    rawCatProducts.length >= 4
      ? rawCatProducts
      : [
        ...rawCatProducts,
        ...[
          { id: `${selectedCat.id}_p1`, categoryId: selectedCat.id, title: `${selectedCat.title}`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: selectedCat.image },
          { id: `${selectedCat.id}_p2`, categoryId: selectedCat.id, title: `${selectedCat.title} - Matte Edition`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[0]?.image || selectedCat.image },
          { id: `${selectedCat.id}_p3`, categoryId: selectedCat.id, title: `${selectedCat.title} - Custom Glass`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[1]?.image || selectedCat.image },
          { id: `${selectedCat.id}_p4`, categoryId: selectedCat.id, title: `${selectedCat.title} - Special Edition`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[2]?.image || selectedCat.image },
          { id: `${selectedCat.id}_p5`, categoryId: selectedCat.id, title: `${selectedCat.title} - Bestseller`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: selectedCat.image },
          { id: `${selectedCat.id}_p6`, categoryId: selectedCat.id, title: `${selectedCat.title} - Premium Case`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[0]?.image || selectedCat.image },
          { id: `${selectedCat.id}_p7`, categoryId: selectedCat.id, title: `${selectedCat.title} - Ultra Glossy`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[1]?.image || selectedCat.image },
          { id: `${selectedCat.id}_p8`, categoryId: selectedCat.id, title: `${selectedCat.title} - Tough Shockproof`, price: selectedCat.startingPrice || 499, oldPrice: 999, off: '50% off', badge: 'SALE', image: rawCatProducts[2]?.image || selectedCat.image }
        ].slice(0, Math.max(4, 8 - rawCatProducts.length))
      ]
  ) : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. TOP GOLDEN BANNER */}
      <div className="bg-[#f59e0b] text-zinc-950 text-xs sm:text-[13px] font-black py-2 px-4 text-center tracking-wide uppercase shadow-inner">
        Your Design. Your Style. Your Pravar.
      </div>

      {/* ========================================================================= */}
      {/* A. DEDICATED CATEGORY COLLECTION VIEW (MATCHING USER IMAGES 1 & 2)        */}
      {/* ========================================================================= */}
      {selectedCat ? (
        <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-700 hover:text-black transition-colors cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-3.5 py-1.5 rounded-full"
            >
              <ArrowLeft size={15} /> Back to all categories
            </button>

            <div className="text-xs text-zinc-500 hidden sm:flex items-center gap-2">
              <span
                className="hover:underline cursor-pointer"
                onClick={() => {
                  if (setCurrentPage) setCurrentPage('home');
                  else navigate('/');
                }}
              >
                Home
              </span>
              <span>/</span>
              <span className="hover:underline cursor-pointer" onClick={handleBackToCategories}>
                Categories
              </span>
              <span>/</span>
              <span className="font-bold text-zinc-900">{selectedCat.title}</span>
            </div>
          </div>

          {/* 1. HERO BANNER (MATCHING IMAGE 1: STICKOVER STYLE) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0a0a0c] via-[#111216] to-[#08080a] text-white p-6 sm:p-12 lg:p-16 border border-zinc-800 shadow-2xl">
            {/* Subtle warm glow background accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left Headline, Price & Value Props */}
              <div className="flex-1 max-w-xl text-left">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.18] tracking-tight">
                  {selectedCat.bannerHeadline || 'Make Your Smartphone Case Stand Out From The Crowd'}
                </h1>

                <div className="w-full max-w-md h-[1px] bg-zinc-700/80 my-5 sm:my-7" />

                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  Starting @ ₹ {selectedCat.startingPrice || 499}/-
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium tracking-wide mt-4 sm:mt-5">
                  <span>Free Shipping</span>
                  <span className="text-zinc-600">|</span>
                  <span>No Hidden Charges</span>
                </div>
              </div>

              {/* Right Phone Case Mockups matching Image 1 */}
              <div className="shrink-0 flex items-center justify-center gap-4 sm:gap-7">
                {selectedCat.bannerImage ? (
                  <img
                    src={selectedCat.bannerImage}
                    alt={selectedCat.title}
                    className="max-h-[360px] w-auto object-contain rounded-2xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                  />
                ) : (
                  <>
                    {/* Phone Case 1 (Left Case with Black Bumper & Camera Module) */}
                    <div className="w-32 h-56 sm:w-44 sm:h-76 md:w-52 md:h-92 rounded-[28px] sm:rounded-[38px] bg-zinc-950 p-1.5 sm:p-2 border-[3px] border-zinc-700 shadow-2xl relative overflow-hidden flex flex-col items-center drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-300">
                      {/* Realistic Camera Bump Cutout */}
                      <div className="absolute top-2 left-2 w-8 h-12 sm:w-11 sm:h-16 bg-black/95 rounded-xl sm:rounded-2xl border border-zinc-700/90 z-20 flex flex-col items-center justify-around py-1 shadow-inner">
                        <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-900 border-2 border-zinc-600 ring-1 ring-zinc-700"></div>
                        <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-900 border-2 border-zinc-600 ring-1 ring-zinc-700"></div>
                      </div>
                      <img
                        src={selectedCatProducts[0]?.image || selectedCat.image}
                        alt={selectedCat.title}
                        className="w-full h-full object-cover rounded-[22px] sm:rounded-[32px]"
                      />
                    </div>

                    {/* Phone Case 2 (Right Case with Black Bumper & Camera Module) */}
                    <div className="w-32 h-56 sm:w-44 sm:h-76 md:w-52 md:h-92 rounded-[28px] sm:rounded-[38px] bg-zinc-950 p-1.5 sm:p-2 border-[3px] border-zinc-700 shadow-2xl relative overflow-hidden flex flex-col items-center drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300">
                      {/* Realistic Camera Bump Cutout */}
                      <div className="absolute top-2 left-2 w-8 h-12 sm:w-11 sm:h-16 bg-black/95 rounded-xl sm:rounded-2xl border border-zinc-700/90 z-20 flex flex-col items-center justify-around py-1 shadow-inner">
                        <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-900 border-2 border-zinc-600 ring-1 ring-zinc-700"></div>
                        <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-900 border-2 border-zinc-600 ring-1 ring-zinc-700"></div>
                      </div>
                      <img
                        src={selectedCatProducts[1]?.image || selectedCat.image}
                        alt={selectedCat.title}
                        className="w-full h-full object-cover rounded-[22px] sm:rounded-[32px]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. CATEGORY TITLE HEADER (MATCHING IMAGE 2) */}
          <div className="mt-10 sm:mt-14 mb-6 sm:mb-8 flex items-baseline justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 uppercase tracking-tight">
                {selectedCat.title}
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                {selectedCatProducts.length} Premium Custom Designs Available
              </p>
            </div>
          </div>

          {/* 3. PRODUCT CARDS 4-COLUMN GRID (MATCHING IMAGE 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
            {selectedCatProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200/90 hover:border-zinc-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Image Container with Top-Left Black SALE Badge */}
                <div className="relative bg-[#f4f4f5] aspect-[4/5] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                  <span className="absolute top-3 left-3 bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-xs shadow-xs z-10">
                    {prod.badge || 'SALE'}
                  </span>
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info Directly Below Image */}
                <div className="p-3 sm:p-4 pt-2">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-black line-clamp-1">
                    {prod.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm">
                    <span className="font-extrabold text-zinc-950">₹{prod.price || 499}</span>
                    <span className="text-xs text-zinc-400 line-through">₹{prod.oldPrice || 999}</span>
                    <span className="font-bold text-xs text-emerald-600">{prod.off || '50% off'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* B. SPLIT-RAIL CATEGORY EXPLORER (MATCHING HOME & USER SCREENSHOT)        */
        /* ========================================================================= */
        <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-row min-h-[calc(100vh-120px)] bg-white border-b border-zinc-200/80">
          {/* Left Vertical Navigation Rail */}
          <aside className="w-24 sm:w-28 md:w-32 lg:w-36 shrink-0 bg-white border-r border-zinc-200/90 py-4 sm:py-6">
            <div className="flex flex-col gap-3 sm:gap-5">
              {CATEGORY_SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      setSelectedCat(null);
                    }}
                    className={`relative w-full flex flex-col items-center justify-center py-2 px-1 transition-all cursor-pointer ${
                      isActive
                        ? 'text-[#ea580c]'
                        : 'text-zinc-700 hover:text-black'
                    }`}
                  >
                    {/* Active Orange Bar on Left Edge */}
                    {isActive && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 bg-[#ea580c] rounded-r" />
                    )}

                    {/* Circular Icon with Orange Ring when Active */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full p-0.5 overflow-hidden transition-transform duration-300 ${
                      isActive
                        ? 'border-2 border-[#ea580c] ring-2 ring-[#ea580c]/30 scale-105 shadow-sm bg-white'
                        : 'border border-zinc-200 bg-[#f4f4f6]'
                    }`}>
                      <img
                        src={sec.icon}
                        alt={sec.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Label below icon */}
                    <span className={`text-xs sm:text-[13px] tracking-tight mt-1.5 font-bold text-center leading-tight line-clamp-2 px-1 ${
                      isActive ? 'text-[#ea580c] font-black' : 'text-zinc-700'
                    }`}>
                      {sec.shortName || sec.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Circular Categories Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-white flex flex-col justify-start">
            {/* Section Subtitle */}
            <div className="mb-5 sm:mb-7">
              <p className="text-zinc-500 text-xs sm:text-sm font-medium">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Circular Category Bubbles matching User Screenshot */}
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8">
                {displayCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center cursor-pointer select-none"
                  >
                    {/* Circular Bubble Card */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-white border border-zinc-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] group-hover:shadow-md group-hover:scale-105 group-hover:border-[#ea580c] group-hover:ring-2 group-hover:ring-[#ea580c]/30 transition-all duration-300 p-1 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />
                    </div>

                    {/* Title Directly Underneath */}
                    <h4 className="mt-2 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[100px] sm:max-w-[125px] transition-colors">
                      {cat.title}
                    </h4>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-zinc-200 rounded-2xl">
                <p className="text-zinc-400 text-xs sm:text-sm">
                  No categories in this section yet.
                </p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
