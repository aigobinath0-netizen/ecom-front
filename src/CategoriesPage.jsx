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
  const [activeSectionId, setActiveSectionId] = useState('all');
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

  const displayCategories = activeCategories;
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

  // Products belonging to the selected category - strictly user-added products only
  const selectedCatProducts = selectedCat
    ? products.filter(p => p.categoryId === selectedCat.id || p.categoryTitle === selectedCat.title)
    : [];

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
                        src={selectedCatProducts[1]?.image || selectedCatProducts[0]?.image || selectedCat.image}
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
          {selectedCatProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-200 rounded-2xl my-8">
              <p className="text-zinc-500 font-medium">No products added to this category yet.</p>
            </div>
          ) : (
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
                      {prod.oldPrice && <span className="text-xs text-zinc-400 line-through">₹{prod.oldPrice}</span>}
                      {prod.off && <span className="font-bold text-xs text-emerald-600">{prod.off}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* B. CATEGORY GRID (MATCHING ZAPVI IMAGE 2)                                */
        /* ========================================================================= */
        <div className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* Section Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8 sm:mb-12">
            {[
              { id: 'all', name: 'All Categories' },
              { id: 'phone_cover', name: 'Mobile Covers' },
              { id: 'temper_glass', name: 'Phone Temper Glass' },
              { id: 'laptop_skin', name: 'Phone & Laptop Skin' }
            ].map((tab) => {
              const isActive = activeSectionId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSectionId(tab.id);
                    setSelectedCat(null);
                  }}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-md'
                      : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* 5-Column Grid of Rounded Category Cards Matching Image 2 */}
          {displayCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
              {displayCategories.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="group flex flex-col items-center cursor-pointer select-none"
                >
                  {/* Rounded Rectangular Card Image (Matching Image 2) */}
                  <div className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-xl group-hover:border-zinc-400 group-hover:-translate-y-1 transition-all duration-300 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Title Centered Below Card (Matching Image 2) */}
                  <h3 className="mt-2 sm:mt-2.5 text-center text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-1 max-w-full transition-colors">
                    {cat.title}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-zinc-200 rounded-3xl">
              <p className="text-zinc-400 text-xs sm:text-sm font-medium">
                No categories in this section yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
