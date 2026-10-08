import React from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ShoppingBag,
  Star,
  CheckCircle2
} from 'lucide-react';

export default function Cart({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCurrentPage 
}) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 499) * item.quantity, 0);
  const totalOldPrice = cart.reduce((sum, item) => sum + (Number(item.oldPrice) || 799) * item.quantity, 0);
  const totalSavings = Math.max(0, totalOldPrice - subtotal);

  const customerReviews = [
    {
      img: '/images/12857815f64121652110d55a.jpg',
      name: 'Vignesh R.',
      city: 'Chennai',
      text: 'Acrylic quality is super strong, print is crystal clear! Worth every rupee.'
    },
    {
      img: '/images/205b687b5984e27498d34508.jpg',
      name: 'Karthik S.',
      city: 'Coimbatore',
      text: 'Delivery was fast within 2 days in Tamil Nadu. Perfect fit for my phone.'
    },
    {
      img: '/images/5614fd0ad59c8c744a12c6bd.jpg',
      name: 'Suresh Kumar',
      city: 'Madurai',
      text: 'Edge protection is awesome and UV gloss finish looks premium!'
    },
    {
      img: '/images/775458021d53df2ec155cb9f.jpg',
      name: 'Praveen M.',
      city: 'Salem',
      text: 'Got Murugan case with custom wording. Very happy with the finish!'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Top Trust Strip / Marquee - Exactly matching Screenshot 1 */}
      <div className="bg-black text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 overflow-hidden border-b border-zinc-800">
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-center">
          <span className="flex items-center gap-1.5 text-zinc-200">
            ✨ <strong className="text-white">59K+</strong> Instagram Followers
          </span>
          <span className="flex items-center gap-1.5 text-zinc-200">
            ❤️ <strong className="text-white">50,000+</strong> Happy Customers
          </span>
          <span className="flex items-center gap-1.5 text-zinc-200">
            📍 Based in Tamil Nadu Serving All India
          </span>
          <span className="flex items-center gap-1.5 text-zinc-200">
            ⚡ All India Fast Delivery
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
            🛡️ TRUSTED STORE
          </span>
          <span className="flex items-center gap-1.5 text-zinc-200">
            Serving Customers Since 2018 ❤️
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-20 w-full pt-8 sm:pt-10">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
          <button
            onClick={() => setCurrentPage('collection')}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={15} /> Continue Shopping
          </button>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-zinc-400 hover:text-rose-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            Your Cart <span className="text-zinc-400 font-medium text-lg sm:text-xl">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200 p-8 max-w-xl mx-auto my-6">
            <div className="w-16 h-16 bg-zinc-200 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 mb-2">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mb-6">
              Looks like you haven't added any phone cases to your cart yet. Explore our premium collections!
            </p>
            <button
              onClick={() => setCurrentPage('collection')}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-6 py-3.5 rounded-full transition-colors shadow-md cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center shadow-sm hover:shadow-md transition-shadow relative"
                >
                  {/* Product Thumbnail */}
                  <div className="w-20 sm:w-24 aspect-[3/4] bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-2xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 pr-6">
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 break-words leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Selected Phone Model */}
                      {item.model && (
                        <p className="text-[11px] sm:text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1.5">
                          {item.model}
                        </p>
                      )}

                      {/* Custom Wording (Murugan or Custom) */}
                      {item.wording && (
                        <p className="text-[11px] sm:text-xs text-emerald-600 font-bold mt-1">
                          MURUGAN WORDINGS: {item.wording}
                        </p>
                      )}
                    </div>

                    {/* Quantity & Price Controls */}
                    <div className="flex items-center justify-between mt-4 pt-2">
                      {/* Quantity Pill - Matching Screenshot 1 */}
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 font-bold transition-colors cursor-pointer text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 font-bold transition-colors cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-zinc-900">
                          ₹{(Number(item.price) || 499) * item.quantity}
                        </div>
                        {item.oldPrice && (
                          <div className="text-[11px] text-zinc-400 line-through">
                            ₹{(Number(item.oldPrice) || 799) * item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Top Right Trash Icon) */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-zinc-300 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: ORDER SUMMARY - Sticky */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-sm text-zinc-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-bold text-zinc-900">₹{subtotal}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span>You save</span>
                      <span className="font-bold">₹{totalSavings}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-zinc-500 text-xs">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="border-t border-zinc-200 pt-3.5 flex justify-between items-center text-base sm:text-lg font-black text-zinc-950">
                    <span>Total</span>
                    <span>₹{subtotal}</span>
                  </div>
                </div>

                {/* Proceed to Checkout Button - Golden Yellow Gradient */}
                <button
                  type="button"
                  onClick={() => setCurrentPage('checkout')}
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 font-black py-4 rounded-full text-center transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base tracking-wide"
                >
                  Proceed to Checkout
                </button>

                {/* Security trust badges */}
                <div className="flex items-center justify-center gap-4 mt-5 text-[11px] font-bold text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-emerald-600" /> SECURE PAYMENTS
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" /> SECURE CHECKOUT
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WHAT OUR CUSTOMERS SAY SECTION - Matching Screenshot 1 */}
        <div className="mt-20 pt-10 border-t border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              What Our Customers Say
            </h2>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-bold text-amber-800 self-start sm:self-auto">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>5.0/5</span>
              <span className="text-zinc-500 font-normal">from 15+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {customerReviews.map((rev, i) => (
              <div 
                key={i} 
                className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 mb-3 border border-zinc-100">
                  <img 
                    src={rev.img} 
                    alt={rev.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed flex-1 mb-3">
                  "{rev.text}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-50 text-[11px]">
                  <span className="font-bold text-zinc-900 flex items-center gap-1">
                    {rev.name} <CheckCircle2 size={11} className="text-emerald-600" />
                  </span>
                  <span className="text-zinc-400">{rev.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
