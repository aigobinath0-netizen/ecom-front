import React from 'react';

export default function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-wide mb-4">
            Get In Touch With Support
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto">
            Have questions about your order, shipping, or a custom design? We're here to help.
          </p>
        </div>

        <div className="flex flex-col">
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-zinc-200">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-0">Email Address</div>
            <div className="text-sm sm:text-base font-bold text-zinc-900">
              <a href="mailto:Ponthamil26@gmail.com" className="hover:text-amber-500 transition-colors">
                Ponthamil26@gmail.com
              </a>
            </div>
          </div>

          {/* Call */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-zinc-200">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-0">Call / Message</div>
            <div className="text-sm sm:text-base font-bold text-zinc-900 text-left sm:text-right">
              <div className="flex flex-col sm:items-end gap-1">
                <a href="tel:+918825544004" className="hover:text-amber-500 transition-colors">+91 88255 44004</a>
                <a href="tel:+917708155630" className="hover:text-amber-500 transition-colors">+91 77081 55630</a>
                <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-wide">Available 10 AM – 5 PM</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-zinc-200">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-0">Location</div>
            <div className="text-sm sm:text-base font-bold text-zinc-900">
              <a 
                href="https://maps.app.goo.gl/RFm6MfcBsEBwGaeT7?g_st=iw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors"
              >
                Distributor Salem, Poonthamil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
