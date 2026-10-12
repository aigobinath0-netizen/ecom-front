import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones } from 'lucide-react';
import {
  CATEGORY_SECTIONS,
  getStoredCategories,
  fetchCategoriesFromApi,
  normalizeCategorySection
} from './categoryData';
import heroVideo from './assets/watermark-removed (1).mp4';

export default function Home({ setCurrentPage, onSelectCategory }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(getStoredCategories());
  const [activeSectionId, setActiveSectionId] = useState('all');

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

  const displayCategories = activeSectionId === 'all'
    ? allWithSections
    : allWithSections.filter(c => c.section === activeSectionId);

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else if (setCurrentPage) {
      setCurrentPage('categories');
    }
    const catSlug = cat.slug || cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/collections/${catSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* 4. CATEGORY GRID (MATCHING ZAPVI IMAGE 2) */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 mt-8 sm:mt-12">
        {/* Category Filter Pills (Minimal & Sleek) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6 sm:mb-10">
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
                onClick={() => setActiveSectionId(tab.id)}
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
      </section>
    </main>
  );
}
