import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Headphones, Star, ArrowRight } from 'lucide-react';
import { getStoredCategories, getStoredProducts, fetchCategoriesFromApi, fetchProductsFromApi } from './categoryData';
import heroVideo from './assets/watermark-removed (1).mp4';

export default function Home({ setCurrentPage, onSelectCategory, onSelectProduct }) {
  const [categories, setCategories] = useState(getStoredCategories());
  const [popularProducts, setPopularProducts] = useState(getStoredProducts().slice(0, 8));
  const [allProducts, setAllProducts] = useState(getStoredProducts());

  useEffect(() => {
    // 1. Initial cached state
    setCategories(getStoredCategories());
    const cachedProds = getStoredProducts();
    setAllProducts(cachedProds);
    setPopularProducts(cachedProds.slice(0, 8));

    // 2. Fetch live data from server
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
    fetchProductsFromApi().then(prods => {
      if (Array.isArray(prods)) {
        setAllProducts(prods);
        setPopularProducts(prods.slice(0, 8));
      }
    });
  }, []);

  return (
    <main className="flex-1 bg-white text-zinc-900 pb-20">
      {/* 1. TOP SLEEK MARQUEE (MINIMALIST LUXURY) */}
      <div className="bg-black text-white py-2.5 overflow-hidden border-b border-zinc-900">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0 px-4 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <span className="bg-[#ea580c] text-white text-[10px] font-black px-2 py-0.5 rounded-sm">SINCE 2018</span>
                <span>CUSTOM ACRYLIC CASES FOR 500+ PHONE MODELS</span>
              </span>
              <span className="text-zinc-500">•</span>
              <span>STARTING AT JUST ₹499</span>
              <span className="text-zinc-500">•</span>
              <span>FREE SHIPPING ACROSS INDIA 🇮🇳</span>
              <span className="text-zinc-500">•</span>
              <span>PREMIUM 9H ACRYLIC GLASS PROTECTION</span>
              <span className="text-zinc-500">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HERO VIDEO (CLEAN BEZEL) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-4 sm:pt-8">
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black border border-zinc-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)]" style={{ aspectRatio: '16 / 9' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={heroVideo}
          />
        </div>
      </section>

      {/* 3. VALUE PROPOSITIONS STRIP (CLEAN MINIMAL) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 mt-6 sm:mt-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-8 border-y border-zinc-100 py-4 sm:py-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900" strokeWidth={1.75} />
            <div className="text-left sm:text-left">
              <h4 className="text-[11px] sm:text-xs font-bold text-zinc-900 uppercase tracking-wide">Free Shipping</h4>
              <p className="hidden sm:block text-[11px] text-zinc-500">All orders across India</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 border-x border-zinc-100">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900" strokeWidth={1.75} />
            <div className="text-left sm:text-left">
              <h4 className="text-[11px] sm:text-xs font-bold text-zinc-900 uppercase tracking-wide">Premium Acrylic</h4>
              <p className="hidden sm:block text-[11px] text-zinc-500">Anti-scratch & 9H strong</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900" strokeWidth={1.75} />
            <div className="text-left sm:text-left">
              <h4 className="text-[11px] sm:text-xs font-bold text-zinc-900 uppercase tracking-wide">Customer Support</h4>
              <p className="hidden sm:block text-[11px] text-zinc-500">Instant WhatsApp help</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CATEGORIES GRID (MATCHING ZAPVI CLEAN 5-COLUMN DESIGN) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 mt-8 sm:mt-12">
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black tracking-tight">
              Phone Cases & Categories
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
              Customized for iPhone, Samsung, OnePlus & all popular devices
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('all');
              else if (setCurrentPage) setCurrentPage('categories');
            }}
            className="text-xs font-bold text-zinc-900 hover:text-zinc-600 underline underline-offset-4 cursor-pointer"
          >
            View all categories &rarr;
          </button>
        </div>

        {/* 5-Column Grid Matching Zapvi Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 md:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat);
                else if (setCurrentPage) setCurrentPage('categories');
              }}
              className="group flex flex-col items-center cursor-pointer select-none"
            >
              {/* Rounded Square Image Box */}
              <div className="w-full aspect-square rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#f4f4f6] relative border border-zinc-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] group-hover:shadow-md transition-all duration-300">
                <img
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  src={cat.image}
                  loading="lazy"
                />
              </div>

              {/* Title Directly Underneath */}
              <h3 className="mt-2.5 sm:mt-3 text-center text-xs sm:text-[13px] md:text-sm font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 transition-colors px-1">
                {cat.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TRENDING BESTSELLERS GRID (SCREENSHOT 2 STYLE) */}
      {popularProducts.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 mt-16 sm:mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight">
              Trending Bestsellers
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 uppercase tracking-wider">
              Most loved custom phone cases across India
            </p>
          </div>

          {/* 4 Column Product Grid Matching Screenshot 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map((prod, idx) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct && onSelectProduct(prod)}
                className="group flex flex-col cursor-pointer"
              >
                {/* Studio Grey Image Container with Badges */}
                <div className="relative bg-[#f4f4f5] rounded-lg overflow-hidden aspect-square sm:aspect-[4/5] flex items-center justify-center p-4">
                  {/* Badge in Top Left: Green NEW or Gold BEST SELLER */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {idx % 2 === 0 ? (
                      <span className="bg-[#16a34a] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        NEW
                      </span>
                    ) : (
                      <span className="bg-[#ca8a04] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        BEST SELLER
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <img
                    alt={prod.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    src={prod.image}
                  />
                </div>

                {/* Text Info Below Image */}
                <div className="pt-3 text-center">
                  <h3 className="text-xs sm:text-sm font-medium text-zinc-900 group-hover:text-black line-clamp-1">
                    {prod.title}
                  </h3>

                  {/* Gold Star Rating */}
                  <div className="flex items-center justify-center gap-1 mt-1 text-[#f59e0b] text-xs">
                    <span>★★★★★</span>
                    <span className="text-zinc-400 text-[11px] font-normal">(28)</span>
                  </div>

                  {/* Price in clean black text */}
                  <p className="text-xs sm:text-sm font-semibold text-zinc-950 mt-1">
                    from Rs. {prod.price}.00
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Minimalist Black VIEW ALL Button (Screenshot 2) */}
          <div className="text-center mt-12 mb-6">
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                else if (setCurrentPage) setCurrentPage('categories');
              }}
              className="bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-[0.2em] px-10 py-3.5 transition-colors cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>
        </section>
      )}

      {/* 6. CATEGORY-WISE PRODUCT SECTIONS (MATCHING SCREENSHOT 2) */}
      {categories.map((category) => {
        const categoryProducts = allProducts.filter(p => p.categoryId === category.id);
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 mt-16 sm:mt-20">
            <div className="flex items-end justify-between border-b border-zinc-200 pb-3 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-black uppercase tracking-tight">
                  {category.title}
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                  Starting from Rs. 499.00
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-bold text-zinc-900 hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(category);
                  else if (setCurrentPage) setCurrentPage('categories');
                }}
              >
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categoryProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  className="group flex flex-col cursor-pointer"
                >
                  <div className="relative bg-[#f4f4f5] rounded-lg overflow-hidden aspect-square sm:aspect-[4/5] flex items-center justify-center p-4">
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {idx % 2 === 0 ? (
                        <span className="bg-[#16a34a] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs">
                          NEW
                        </span>
                      ) : (
                        <span className="bg-[#ca8a04] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs">
                          BEST SELLER
                        </span>
                      )}
                    </div>

                    <img
                      alt={prod.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      src={prod.image}
                    />
                  </div>

                  <div className="pt-3 text-center">
                    <h3 className="text-xs sm:text-sm font-medium text-zinc-900 group-hover:text-black line-clamp-1">
                      {prod.title}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[#f59e0b] text-xs">
                      <span>★★★★★</span>
                      <span className="text-zinc-400 text-[11px] font-normal">(19)</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-950 mt-1">
                      Rs. {prod.price}.00
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

