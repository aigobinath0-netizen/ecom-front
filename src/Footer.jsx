import React from 'react';
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react';

export default function Footer() {
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
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Follow Us</h3>
            <div className="flex items-center gap-8">
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">Facebook</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">Instagram</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">YouTube</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm h-px bg-zinc-800"></div>

          {/* Payments */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-white text-xs font-black uppercase tracking-widest">100% Secure Payments</h3>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {/* Placeholder pills for payment methods since we don't have SVGs */}
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-zinc-900 flex items-center gap-1">
                <span className="text-blue-500">G</span>Pay
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-[#5f259f] flex items-center">
                PhonePe
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-[#002970] flex items-center">
                Paytm
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-green-600 flex items-center">
                BHIM UPI
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-blue-800 flex items-center">
                VISA
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-red-500 flex items-center">
                MasterCard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Section */}
      <div className="bg-white py-16 px-4 rounded-t-3xl -mt-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-40">
            {/* Company Links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">Company</h4>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">About Us</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Terms & Conditions</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Shipping Policy</a>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">Support</h4>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Contact Us</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Track Order</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">Cancellations & Refunds</a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 font-semibold transition-colors">FAQ's</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-20 pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <img alt="Pravar Wraps" className="h-6 w-6 object-cover rounded-full" src="/images/logo-mark-ayXhBs9R.png" />
              <span className="font-coolvetica font-black text-sm text-zinc-950 tracking-wider uppercase">PRAVAR WRAPS</span>
            </div>
            <p className="text-[10px] font-medium text-zinc-400">
              Copyright © 2026. All rights reserved by www.pravarwraps.in
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918825544004" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50"
      >
        <MessageCircle size={30} fill="currentColor" />
      </a>
    </footer>
  );
}
