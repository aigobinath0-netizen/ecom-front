import React, { useState } from 'react';
import { ShieldCheck, Truck, ChevronDown } from 'lucide-react';

export default function Footer({ navigateTo }) {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <footer className="w-full flex flex-col">
      {/* Banner */}
      <div className="bg-[#0a0a0a] border-b border-zinc-900 w-full py-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <div className="flex items-center justify-center gap-3 py-2 md:py-0">
            <ShieldCheck size={20} className="text-white" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">Premium Quality Assured</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-2 md:py-0">
            <Truck size={20} className="text-white" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">Free and Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Black Section */}
      <div className="bg-zinc-950 py-12 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-12">
          
          {/* Follow Us */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-white text-[11px] font-black uppercase tracking-widest">Follow Us</h3>
            <div className="flex items-center gap-8 md:gap-10">
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </div>
                <span className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors mt-1">Facebook</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <span className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors mt-1">Instagram</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-[#FF0000] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/></svg>
                </div>
                <span className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors mt-1">YouTube</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm h-px bg-zinc-800"></div>

          {/* Payments */}
          <div className="flex flex-col items-center gap-8">
            <h3 className="text-white text-[13px] font-black uppercase tracking-widest">100% Secure Payments</h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center p-2.5 md:p-3">
                <img src="/images/gpay-DZuSeGay.svg" alt="GPay" className="w-full h-full object-contain" />
              </div>
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center text-[#5f259f] font-bold text-[22px] md:text-2xl">
                पे
              </div>
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center p-2.5 md:p-3">
                <img src="/images/paytm-BCncP83O.svg" alt="Paytm" className="w-full h-full object-contain" />
              </div>
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center p-2.5 md:p-3">
                <img src="/images/bhim-Bub5lxWs.svg" alt="BHIM UPI" className="w-full h-full object-contain" />
              </div>
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center p-2.5 md:p-3">
                <img src="/images/visa-electron-C4lk8-Ua.svg" alt="VISA" className="w-full h-full object-contain" />
              </div>
              <div className="w-[52px] h-[52px] md:w-[60px] md:h-[60px] bg-white rounded-full flex items-center justify-center p-2.5 md:p-3">
                <img src="/images/maestro-XTo_AsLt.svg" alt="MasterCard" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Section */}
      <div className="bg-white py-8 md:py-12 px-6 rounded-t-3xl -mt-6 relative z-10 pb-20 md:pb-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-40">
            {/* Company Links */}
            <div className="border-b border-zinc-100 py-5 md:border-none md:py-0 flex flex-col">
              <button 
                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                className="w-full flex items-center justify-between md:pointer-events-none"
              >
                <h4 className="text-[15px] md:text-sm font-black text-zinc-900 uppercase tracking-widest md:mb-2">Company</h4>
                <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 md:hidden ${isCompanyOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`flex-col gap-4 mt-6 md:mt-2 md:flex ${isCompanyOpen ? 'flex' : 'hidden'}`}>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs?category=about')}>About Us</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs?category=payment')}>Terms & Conditions</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs?category=payment')}>Privacy Policy</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs?category=shipping')}>Shipping Policy</a>
              </div>
            </div>

            {/* Support Links */}
            <div className="border-b border-zinc-100 py-5 md:border-none md:py-0 flex flex-col">
              <button 
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className="w-full flex items-center justify-between md:pointer-events-none"
              >
                <h4 className="text-[15px] md:text-sm font-black text-zinc-900 uppercase tracking-widest md:mb-2">Support</h4>
                <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 md:hidden ${isSupportOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`flex-col gap-4 mt-6 md:mt-2 md:flex ${isSupportOpen ? 'flex' : 'hidden'}`}>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('contact')}>Contact Us</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('track')}>Track Order</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs?category=returns')}>Cancellations & Refunds</a>
                <a className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors" onClick={() => navigateTo('faqs')}>FAQ's</a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 md:mt-20 md:pt-8 md:border-t md:border-zinc-100 flex flex-col items-center justify-center text-center gap-3 md:gap-4 w-full">
            <div className="flex items-center justify-center gap-2">
              <img alt="Pravar Wraps" className="h-6 w-6 md:h-6 md:w-6 object-cover rounded-full" src="/images/logo-mark-ayXhBs9R.png" />
              <span className="font-coolvetica font-black text-[15px] md:text-sm text-zinc-950 tracking-wider uppercase">PRAVAR WRAPS</span>
            </div>
            <p className="text-[13px] md:text-[10px] text-zinc-400 font-medium text-center leading-relaxed">
              Copyright © 2026. All rights reserved by <br className="sm:hidden" /> www.pravarwraps.com
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918825544004" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-[85px] lg:bottom-6 right-4 lg:right-6 w-[56px] h-[56px] bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>
    </footer>
  );
}
