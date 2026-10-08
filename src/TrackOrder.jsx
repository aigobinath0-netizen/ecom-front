import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function TrackOrder() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-wide">
            Track Your Order
          </h1>
        </div>

        <div className="bg-white border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-3xl p-8 sm:p-12 mb-16 text-center max-w-2xl mx-auto">
          <div className="mx-auto flex items-center justify-center mb-8">
            <MessageCircle className="w-12 h-12 text-[#25D366]" strokeWidth={2} />
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-8 leading-relaxed">
            Once you place your order, we process it and <br className="hidden sm:block" /> create your shipment.
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-600 mb-6 leading-relaxed max-w-xl mx-auto">
            After that, you'll receive your tracking ID along with the tracking link directly on our <strong className="font-bold text-zinc-900">official WhatsApp number</strong>.
          </p>
          
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto">
            If you haven't received it yet, please wait a little — our team is preparing your order and will send the tracking details as soon as it's shipped.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-[11px] sm:text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">
            Our Official Shipping Partners
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* ST Courier */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 text-left hover:shadow-md transition-shadow">
              <h4 className="font-bold text-zinc-900 mb-1">ST Courier</h4>
              <p className="text-xs text-zinc-500 mb-8">Delivery in 3–5 business days</p>
              <a 
                href="https://stcourier.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-zinc-900 hover:text-amber-500 transition-colors underline underline-offset-4"
              >
                Track on stcourier.com &rarr;
              </a>
            </div>

            {/* India Post */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 text-left hover:shadow-md transition-shadow">
              <h4 className="font-bold text-zinc-900 mb-1">India Post</h4>
              <p className="text-xs text-zinc-500 mb-8">Delivery in 7 business days</p>
              <a 
                href="https://www.indiapost.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-zinc-900 hover:text-amber-500 transition-colors underline underline-offset-4"
              >
                Track on indiapost.gov.in &rarr;
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
