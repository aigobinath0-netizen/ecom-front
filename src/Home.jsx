import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getStoredCategories,
  fetchCategoriesFromApi,
  normalizeCategorySection
} from './categoryData';
import heroVideo from './assets/watermark-removed (1).mp4';

// 3 Main Topics matching user's paper sketch: Cover, Temper Glass, Skin
const HOME_SECTIONS = [
  {
    id: 'phone_cover',
    title: 'Phone Cover',
    tag: 'Cover',
    badge: 'Popular',
    subtitle: 'Ready Designs & Trendy Acrylic Glass Cases'
  },
  {
    id: 'temper_glass',
    title: 'Phone Temper Glass',
    tag: 'Tempered Glass',
    badge: 'Protection',
    subtitle: '9H Extreme Anti-Scratch Screen & Lens Protection'
  },
  {
    id: 'laptop_skin',
    title: 'Phone & Laptop Skin',
    tag: 'Skin',
    badge: 'Custom Style',
    subtitle: 'Premium 3M Textured Wraps & Precision Skins'
  }
];

export default function Home({ setCurrentPage, onSelectCategory }) {
  const [categories, setCategories] = useState(getStoredCategories());
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initial cached state from localStorage (only real categories from Spring Boot backend)
    setCategories(getStoredCategories());

    // 2. Fetch live data from Spring Boot backend API
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
  }, []);

  const allWithSections = categories.map(c => ({
    ...c,
    section: normalizeCategorySection(c)
  }));

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    const slug = cat.slug || cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/collections/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle View All directly on the Home page - NEVER navigate away to /categories
  const handleToggleViewAll = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <main className="flex-1 bg-white text-zinc-900 pb-20">
      {/* 0. TOP GOLDEN BANNER */}
      <div className="bg-[#f59e0b] text-zinc-950 text-xs sm:text-[13px] font-black py-2 px-4 text-center tracking-wide uppercase shadow-inner">
        Your Design. Your Style. Your Pravar.
      </div>

      {/* 1. TOP SLEEK MARQUEE */}
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

      {/* 2. HERO VIDEO (Full End-to-End Banner matching Zapvi style) */}
      <section className="w-full overflow-hidden">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[460px] bg-black overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center block"
            src={heroVideo}
          />
        </div>
      </section>

      {/* 3. VALUE PROPOSITIONS STRIP */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-16 mt-4 sm:mt-8">
        <div className="grid grid-cols-3 divide-x divide-zinc-200/80 border-y border-zinc-200/80 py-3.5 sm:py-5">
          {/* 1. Free Shipping */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 px-1.5 sm:px-4 text-center sm:text-left">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0" strokeWidth={1.75} />
            <div className="text-center sm:text-left">
              <h4 className="text-[10px] sm:text-xs font-black text-zinc-950 uppercase tracking-tight sm:tracking-wide leading-tight">
                Free Shipping
              </h4>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 font-medium leading-tight mt-0.5">
                All orders across India
              </p>
            </div>
          </div>

          {/* 2. Premium Acrylic */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 px-1.5 sm:px-4 text-center sm:text-left">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0" strokeWidth={1.75} />
            <div className="text-center sm:text-left">
              <h4 className="text-[10px] sm:text-xs font-black text-zinc-950 uppercase tracking-tight sm:tracking-wide leading-tight">
                Premium Acrylic
              </h4>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 font-medium leading-tight mt-0.5">
                Anti-scratch & 9H strong
              </p>
            </div>
          </div>

          {/* 3. Customer Support */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 px-1.5 sm:px-4 text-center sm:text-left">
            <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 shrink-0" strokeWidth={1.75} />
            <div className="text-center sm:text-left">
              <h4 className="text-[10px] sm:text-xs font-black text-zinc-950 uppercase tracking-tight sm:tracking-wide leading-tight">
                Customer Support
              </h4>
              <p className="text-[9px] sm:text-[11px] text-zinc-500 font-medium leading-tight mt-0.5">
                Instant WhatsApp help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 3 TOPICS WITH STRICT 3*3 GRID (MATCHING USER PAPER SKETCH)              */}
      {/* ========================================================================= */}
      <div className="space-y-14 sm:space-y-20 mt-10 sm:mt-14">
        {HOME_SECTIONS.map((section) => {
          // Strictly real categories belonging to this section from Spring Boot backend
          const sectionCats = allWithSections.filter(c => c.section === section.id);
          const isExpanded = Boolean(expandedSections[section.id]);
          
          // If expanded, show all categories in this section; otherwise show initial 3x3 layout (first 9)
          const itemsToDisplay = isExpanded ? sectionCats : sectionCats.slice(0, 9);
          const hasMoreThan9 = sectionCats.length > 9;

          return (
            <section key={section.id} id={`section-${section.id}`} className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
              {/* Centered Topic Header Container (aligned with 3*3 grid) */}
              <div className="max-w-[420px] mx-auto mb-3.5 sm:mb-5 pb-2 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-end justify-between gap-1.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#ea580c] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
                      {section.tag}
                    </span>
                    <span className="text-zinc-400 text-xs font-semibold">•</span>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      {section.badge}
                    </span>
                    {sectionCats.length > 0 && (
                      <>
                        <span className="text-zinc-400 text-xs font-semibold">•</span>
                        <span className="text-[#ea580c] text-xs font-bold uppercase tracking-wider">
                          {sectionCats.length} {sectionCats.length === 1 ? 'Design' : 'Designs'}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-950 tracking-tight uppercase">
                    {section.title}
                  </h2>
                  <p className="text-zinc-500 text-xs sm:text-[13px] font-medium mt-0.5">
                    {section.subtitle}
                  </p>
                </div>

                {/* Quick Desktop Toggle Button (Stays on Home page) */}
                {sectionCats.length > 0 && (
                  <button
                    onClick={() => handleToggleViewAll(section.id)}
                    className="hidden sm:inline-flex items-center gap-1 text-xs md:text-xs font-extrabold text-[#ea580c] hover:text-black uppercase tracking-wider transition-colors cursor-pointer group shrink-0 pb-0.5"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View All'}</span>
                    {isExpanded ? (
                      <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                    ) : (
                      <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    )}
                  </button>
                )}
              </div>

              {/* STRICT 3*3 GRID: 3 columns across on all screens matching user's paper drawing [ ] [ ] [ ] */}
              <div className="max-w-[420px] mx-auto">
                {itemsToDisplay.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 transition-all">
                    {itemsToDisplay.map((cat, idx) => (
                      <div
                        key={cat.id || idx}
                        onClick={() => handleCategoryClick(cat)}
                        className="group flex flex-col items-center cursor-pointer select-none text-center"
                      >
                        {/* Square Card Container */}
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f4f4f6] border border-zinc-200 shadow-xs group-hover:shadow-md group-hover:scale-105 group-hover:border-[#ea580c] group-hover:ring-2 group-hover:ring-[#ea580c]/30 transition-all duration-300 p-1 sm:p-1.5 flex items-center justify-center">
                          <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Title Directly Underneath */}
                        <h4 className="mt-1 sm:mt-1.5 text-center text-[10px] sm:text-xs font-semibold text-zinc-800 group-hover:text-black tracking-tight leading-snug line-clamp-2 max-w-full transition-colors">
                          {cat.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                    <p className="text-zinc-400 text-xs sm:text-sm font-medium">
                      No categories added yet for {section.title}.
                    </p>
                  </div>
                )}

                {/* Centered "View All" Button beneath the Grid (Stays on Home Page) */}
                <div className="mt-5 sm:mt-7 flex flex-col items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleToggleViewAll(section.id)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-2 border-zinc-900 bg-white hover:bg-black text-zinc-950 hover:text-white font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-xs hover:shadow-md group cursor-pointer active:scale-95"
                  >
                    <span>
                      {isExpanded
                        ? 'Show Less'
                        : (hasMoreThan9 ? `View All (${sectionCats.length})` : 'View All')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={15} className="text-zinc-600 group-hover:text-white transition-transform" />
                    ) : (
                      <ChevronDown size={15} className="text-zinc-600 group-hover:text-white transition-transform" />
                    )}
                  </button>

                  {isExpanded && sectionCats.length > 0 && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Showing all {sectionCats.length} categories on Home Page
                    </span>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
