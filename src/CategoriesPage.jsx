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

  const [categories, setCategories] = useState(getStoredCategories);
  const [products, setProducts] = useState(getStoredProducts);
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

  // Products belonging to the selected category - strictly user-added products
  const matchedCatProducts = selectedCat
    ? products.filter(p => {
        if (!p) return false;
        // 1. Direct category ID match
        if (p.categoryId && (p.categoryId === selectedCat.id || p.categoryId === selectedCat._id)) return true;
        if (p.category && (p.category === selectedCat.id || p.category === selectedCat._id || p.category === selectedCat.title)) return true;
        // 2. Category Title match
        if (p.categoryTitle && p.categoryTitle.toLowerCase() === selectedCat.title.toLowerCase()) return true;
        // 3. Category Slug match
        if (p.categorySlug && selectedCat.slug && p.categorySlug.toLowerCase() === selectedCat.slug.toLowerCase()) return true;
        // 4. Normalized word match (e.g., Sivan/Shivan, Murugan, TVK, Thala, Photo Gold, Temp, Skin)
        const catNorm = (selectedCat.title || '').toLowerCase().replace(/sh/g, 's');
        const prodNorm = (p.title || '').toLowerCase().replace(/sh/g, 's');
        if (prodNorm === catNorm) return true;
        const cleanWords = catNorm.replace(/acrylic|glass|cases|case|mobile|covers|cover|strong/g, '').trim().split(/\s+/).filter(w => w.length >= 3);
        if (cleanWords.length > 0 && cleanWords.some(w => prodNorm.includes(w))) return true;
        if (catNorm.includes('priya') || catNorm.includes('gobi')) {
          if (prodNorm.includes('gold') || prodNorm.includes('photo') || prodNorm.includes('customized')) return true;
        }
        return false;
      })
    : [];

  // Fallback to section products if specific category has no direct products
  const selectedCatProducts = (matchedCatProducts.length > 0 || !selectedCat)
    ? matchedCatProducts
    : products.filter(p => {
        const sec = selectedCat.section || normalizeCategorySection(selectedCat);
        if (sec === 'temper_glass') return (p.title || '').toLowerCase().includes('temp') || (p.title || '').toLowerCase().includes('glass');
        if (sec === 'laptop_skin') return (p.title || '').toLowerCase().includes('skin') || (p.title || '').toLowerCase().includes('wrap');
        return true;
      });

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

          {/* 1. FULL FRAME UPLOADED BANNER IMAGE (MATCHING USER REQUEST) */}
          {(selectedCat.bannerImage || selectedCat.image) && (
            <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-xl border border-zinc-200/80 bg-zinc-950">
              <img
                src={selectedCat.bannerImage || selectedCat.image}
                alt={selectedCat.title}
                className="w-full h-auto aspect-[2/1] sm:aspect-[2.4/1] object-cover block"
              />
            </div>
          )}

          {/* 2. CATEGORY TITLE HEADER (MATCHING USER SCREENSHOT) */}
          <div className="mt-6 sm:mt-10 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-950 tracking-tight">
              {selectedCat.title}
            </h2>
          </div>

          {/* 3. PRODUCT CARDS 2-COLUMN MOBILE GRID (MATCHING USER SCREENSHOT) */}
          {selectedCatProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-200 rounded-2xl my-8">
              <p className="text-zinc-500 font-medium">No products added to this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-20">
              {selectedCatProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    const enrichedProd = {
                      ...prod,
                      categoryId: prod.categoryId || selectedCat?.id,
                      categoryTitle: selectedCat?.title || '',
                      categorySlug: selectedCat?.slug || '',
                      hasTwoPhotos: Boolean(selectedCat?.hasTwoPhotos) || Boolean(prod.hasTwoPhotos)
                    };
                    if (onSelectProduct) {
                      onSelectProduct(enrichedProd, selectedCat);
                    }
                  }}
                  className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 hover:border-zinc-400 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Image Container with Top-Left Black SALE Badge */}
                  <div className="relative bg-[#f4f4f5] aspect-[4/5] flex items-center justify-center p-2.5 sm:p-5 overflow-hidden">
                    <span className="absolute top-2.5 left-2.5 bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-xs shadow-xs z-10">
                      {prod.badge || 'SALE'}
                    </span>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    />
                  </div>

                  {/* Product Info Directly Below Image */}
                  <div className="p-3 sm:p-4 pt-2.5">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-800 group-hover:text-black line-clamp-1">
                      {prod.title}
                    </h3>
                    {(() => {
                      const isTwo = Boolean(selectedCat?.hasTwoPhotos) || Boolean(prod.hasTwoPhotos);
                      const mult = isTwo ? 2 : 1;
                      const pPrice = (Number(prod.price) || 499) * mult;
                      const pOldPrice = (Number(prod.oldPrice) || 999) * mult;
                      return (
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-xs sm:text-sm flex-wrap">
                          <span className="font-extrabold text-zinc-950">₹{pPrice}</span>
                          {isTwo && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                              2 Covers
                            </span>
                          )}
                          <span className="text-[11px] sm:text-xs text-zinc-400 line-through">₹{pOldPrice}</span>
                          <span className="font-bold text-[11px] sm:text-xs text-emerald-600">{prod.off || '50% off'}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* B. SPLIT-RAIL CATEGORY EXPLORER (MATCHING HOME & USER SCREENSHOT)        */
        /* ========================================================================= */
        <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-row min-h-[calc(100vh-120px)] bg-white border-b border-zinc-200/80">
          {/* Left Vertical Navigation Rail (Zapvi Style) */}
          <aside className="w-20 sm:w-24 md:w-28 shrink-0 bg-white border-r border-zinc-200 py-3 sm:py-5">
            <div className="flex flex-col gap-3 sm:gap-4">
              {CATEGORY_SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      setSelectedCat(null);
                    }}
                    className={`relative w-full flex flex-col items-center justify-center py-1.5 px-1 transition-all cursor-pointer ${isActive
                      ? 'text-[#ea580c]'
                      : 'text-zinc-700 hover:text-black'
                      }`}
                  >
                    {/* Active Orange Bar on Left Edge */}
                    {isActive && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 bg-[#ea580c] rounded-r" />
                    )}

                    {/* Circular Icon with Orange Ring when Active */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full p-0.5 overflow-hidden transition-transform duration-300 ${isActive
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
                    <span className={`text-[11px] sm:text-xs tracking-tight mt-1 font-bold text-center leading-tight line-clamp-2 px-1 ${isActive ? 'text-[#ea580c] font-black' : 'text-zinc-700'
                      }`}>
                      {sec.shortName || sec.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Circular Categories Area */}
          <main className="flex-1 p-3 sm:p-5 lg:p-7 min-w-0 bg-white flex flex-col justify-start">
            {/* Section Headline matching Zapvi screenshot */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-black text-zinc-900 uppercase tracking-wide leading-tight">
                {currentSection.headline || 'READY DESIGNS AND TRENDY CASE'}
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-0.5">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Circular Category Bubbles matching User Screenshot: 3 columns on mobile */}
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-6">
                {displayCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    onClick={() => handleCategoryClick(cat)}
                    className="group flex flex-col items-center cursor-pointer select-none text-center"
                  >
                    {/* Circular Bubble Card */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-white border border-zinc-200 shadow-xs group-hover:shadow-md group-hover:scale-105 group-hover:border-[#ea580c] group-hover:ring-2 group-hover:ring-[#ea580c]/30 transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />
                    </div>

                    {/* Title Directly Underneath */}
                    <h4 className="mt-1.5 sm:mt-2 text-center text-[11px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
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
