import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { getStoredCategories, getStoredProducts, fetchCategoriesFromApi, fetchProductsFromApi } from './categoryData';

export default function Home({ setCurrentPage, onSelectCategory, onSelectProduct }) {
  const [categories, setCategories] = useState(getStoredCategories());
  const [popularProducts, setPopularProducts] = useState(getStoredProducts().slice(0, 8));

  useEffect(() => {
    // 1. Initial cached state
    setCategories(getStoredCategories());
    setPopularProducts(getStoredProducts().slice(0, 8));

    // 2. Fetch live data from server
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats)) setCategories(cats);
    });
    fetchProductsFromApi().then(prods => {
      if (Array.isArray(prods)) setPopularProducts(prods.slice(0, 8));
    });
  }, []);

  return (
    <main className="flex-1 pt-4">
      <div className="bg-black overflow-hidden py-2.5">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-10 shrink-0 px-3">
              <span className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-amber-400 text-[#0b1a3a] text-[11px] sm:text-[13px] font-black uppercase tracking-wide px-3 py-1 rounded-full shrink-0">
                <Sparkles size={14} /> <b>Since 2018</b>
              </span>
              <span className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-white/90 text-[11px] sm:text-[13px] font-bold">🎉 Premium Customized Mobile Cases at Just ₹499</span>
              </span>
              <span className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-white/90 text-[11px] sm:text-[13px] font-bold">🔥 Exclusive TVK & Murugan Mobile Cases</span>
              </span>
              <span className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-white/90 text-[11px] sm:text-[13px] font-bold">🚚 Free Shipping Across India 🇮🇳</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto mt-0 sm:mt-6 sm:px-10 lg:px-20">
        <div className="relative w-full overflow-hidden border-0 sm:border sm:border-[#f0f0f2] sm:rounded-2xl sm:shadow-[0_1px_2px_rgba(24,24,27,0.04)]" style={{ aspectRatio: '3548 / 1774' }}>
          <img alt="Banner" className="w-full h-full object-cover" src="/images/3879f4a71d1adb4577d0f498.png" />
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-20 mt-3 sm:mt-6">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-6 bg-white rounded-xl sm:rounded-2xl border border-zinc-100 shadow-sm px-1.5 py-2.5 sm:px-8 sm:py-6">
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <Truck className="w-4 h-4 sm:w-7 sm:h-7 text-amber-500" />
            <span className="text-[7.5px] sm:text-xs font-black text-zinc-900 uppercase tracking-wide leading-tight">Free Shipping</span>
            <span className="hidden sm:block text-[11px] text-zinc-500">For TamilNadu</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <ShieldCheck className="w-4 h-4 sm:w-7 sm:h-7 text-amber-500" />
            <span className="text-[7.5px] sm:text-xs font-black text-zinc-900 uppercase tracking-wide leading-tight">Premium Quality</span>
            <span className="hidden sm:block text-[11px] text-zinc-500">Acrylic strong glass</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <Headphones className="w-4 h-4 sm:w-7 sm:h-7 text-amber-500" />
            <span className="text-[7.5px] sm:text-xs font-black text-zinc-900 uppercase tracking-wide leading-tight">Customer Support</span>
            <span className="hidden sm:block text-[11px] text-zinc-500">We're here to help</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-20">
        <section className="mt-8 sm:mt-14">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-wide">Shop By Category</h2>
            <button
              type="button"
              className="text-xs sm:text-sm font-bold text-zinc-900 border border-zinc-200 rounded-full px-3 py-1.5 hover:bg-zinc-50 whitespace-nowrap cursor-pointer"
              onClick={() => {
                if (onSelectCategory && categories.length > 0) {
                  onSelectCategory(categories[0]);
                } else if (setCurrentPage) {
                  setCurrentPage('collection');
                }
              }}
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-6">
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="group flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(cat);
                    } else if (setCurrentPage) {
                      setCurrentPage('collection');
                    }
                  }}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-zinc-200 group-hover:border-amber-400 group-hover:ring-2 group-hover:ring-amber-400/40 transition-all p-3 flex items-center justify-center">
                    <img alt={cat.title} className="w-full h-full object-contain group-hover:scale-110 transition duration-300 mix-blend-multiply" src={cat.image} />
                  </div>
                  <span className="mt-3 text-[11px] sm:text-sm font-bold leading-snug text-center text-zinc-700 group-hover:text-amber-500 transition-colors line-clamp-2">{cat.title}</span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 px-4 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                <p className="text-sm font-bold text-zinc-800">No categories created yet</p>
                <p className="text-xs text-zinc-500 mt-1 mb-4">Go to Admin Dashboard to create your categories</p>
                <button
                  type="button"
                  onClick={() => setCurrentPage && setCurrentPage('admin')}
                  className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Create Category in Admin
                </button>
              </div>
            )}
          </div>
        </section>

        {popularProducts.length > 0 && (
          <section className="mt-14 mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-6 text-center uppercase tracking-wide">Popular Products</h2>
            <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
              {popularProducts.map((prod) => (
                <div key={prod.id} className="w-[46%] sm:w-[220px] shrink-0 snap-start">
                  <div
                    className="group bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all rounded-2xl overflow-hidden flex flex-col cursor-pointer"
                    onClick={() => onSelectProduct && onSelectProduct(prod)}
                  >
                    <div className="relative bg-zinc-50/40 flex items-center justify-center aspect-[5/6] overflow-hidden rounded-t-2xl p-3">
                      <span className="absolute top-2 left-2 z-10 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">{prod.badge || 'Sale'}</span>
                      <img alt={prod.title} className="w-full h-full object-contain group-hover:scale-110 transition duration-300 mix-blend-multiply" src={prod.image} />
                    </div>
                    <div className="p-2 sm:p-4 text-center">
                      <h3 className="text-xs sm:text-sm text-zinc-900 font-bold break-words whitespace-normal line-clamp-2 min-h-[35px]">{prod.title}</h3>
                      <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-2">
                        <span className="text-zinc-900 font-black text-sm sm:text-base">₹{prod.price}</span>
                        {prod.oldPrice && <span className="text-zinc-400 text-[10px] sm:text-xs line-through">₹{prod.oldPrice}</span>}
                        {prod.off && <span className="text-green-600 text-[10px] sm:text-xs font-semibold">{prod.off}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
