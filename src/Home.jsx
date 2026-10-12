import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Headphones } from 'lucide-react';
import { 
  CATEGORY_SECTIONS, 
  getStoredCategories, 
  fetchCategoriesFromApi, 
  normalizeCategorySection 
} from './categoryData';
import heroVideo from './assets/watermark-removed (1).mp4';

export default function Home({ setCurrentPage, onSelectCategory, onSelectProduct }) {
  const [categories, setCategories] = useState(getStoredCategories());
  const [activeSectionId, setActiveSectionId] = useState('phone_cover');

  useEffect(() => {
    // 1. Initial cached state
    setCategories(getStoredCategories());

    // 2. Fetch live data from server
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
  }, []);

  const allWithSections = categories.map(c => ({
    ...c,
    section: normalizeCategorySection(c)
  }));

  const activeCategories = allWithSections.filter(c => c.section === activeSectionId);
  const currentSection = CATEGORY_SECTIONS.find(s => s.id === activeSectionId) || CATEGORY_SECTIONS[0];

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

      {/* 4. SPLIT-RAIL CIRCULAR CATEGORY EXPLORER (MATCHING FIRST IMAGE) */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 mt-8 sm:mt-12">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black tracking-tight">
              Explore Categories
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
              Select a category to customize phone cases, temper glass & skins
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
            View all &rarr;
          </button>
        </div>

        {/* Split-Rail Layout Container matching First Image */}
        <div className="flex flex-row border border-zinc-200/90 rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-xs">
          
          {/* Left Vertical Navigation Rail */}
          <aside className="w-[82px] sm:w-28 md:w-36 lg:w-44 shrink-0 bg-white border-r border-zinc-200/80 py-3 sm:py-5">
            <div className="flex flex-col gap-1 sm:gap-2">
              {CATEGORY_SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`relative w-full flex flex-col items-center justify-center py-2.5 px-1 sm:p-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-50/50 md:bg-transparent text-[#ea580c]'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    {/* Active Orange Bar on Left Edge */}
                    {isActive && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 sm:w-1.5 bg-[#ea580c] rounded-r" />
                    )}

                    {/* Circular Icon with Orange Ring when Active */}
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

                    {/* Label below icon */}
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

          {/* Right Circular Categories Area */}
          <div className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 bg-[#fafafa]/40 flex flex-col justify-start">
            {/* Section Subtitle */}
            <div className="mb-4 sm:mb-6">
              <p className="text-zinc-500 text-xs sm:text-[13px] font-medium">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Circular Category Bubbles matching First Image */}
            {activeCategories.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2.5 gap-y-4 sm:gap-5 md:gap-7">
                {activeCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      else if (setCurrentPage) setCurrentPage('categories');
                    }}
                    className="group flex flex-col items-center cursor-pointer select-none"
                  >
                    {/* Circular Bubble Card */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-white border border-zinc-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] group-hover:shadow-md group-hover:scale-105 group-hover:border-[#ea580c] transition-all duration-300 p-0.5 sm:p-1 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />
                    </div>

                    {/* Title Directly Underneath */}
                    <h4 className="mt-2 text-center text-[10px] sm:text-xs md:text-[13px] font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-[85px] sm:max-w-[110px] transition-colors">
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
          </div>

        </div>
      </section>
    </main>
  );
}

