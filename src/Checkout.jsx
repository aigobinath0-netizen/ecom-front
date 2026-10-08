import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Users, 
  Star, 
  Zap, 
  Lock,
  MessageCircle,
  ShoppingBag,
  CreditCard
} from 'lucide-react';

export default function Checkout({ 
  cart, 
  clearCart, 
  setCurrentPage 
}) {
  const [formData, setFormData] = useState({
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    pincode: '',
    city: '',
    state: 'Tamil Nadu',
    phone: '',
    altPhone: '',
    saveInfo: true
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [errors, setErrors] = useState({});

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 499) * item.quantity, 0);
  
  // Free shipping in Tamil Nadu, ₹49 elsewhere
  const isTN = formData.state === 'Tamil Nadu';
  const shippingCharge = subtotal > 0 ? (isTN ? 0 : 49) : 0;
  const finalTotal = subtotal + shippingCharge;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate safe order placement / payment
    setTimeout(() => {
      const orderId = 'PW-' + Math.floor(100000 + Math.random() * 900000);
      const placedOrder = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...cart],
        customer: { ...formData },
        total: finalTotal,
        shipping: shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`
      };

      // Save to local storage for track order feature
      try {
        const existingOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
        existingOrders.unshift(placedOrder);
        localStorage.setItem('customer_orders', JSON.stringify(existingOrders));
      } catch (err) {}

      setOrderComplete(placedOrder);
      setIsSubmitting(false);
      clearCart();
    }, 1200);
  };

  // If order is completed successfully, show order confirmation screen
  if (orderComplete) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50/60 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-3 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-sm text-zinc-600 mb-6">
            Thank you, <strong className="text-zinc-900">{orderComplete.customer.firstName} {orderComplete.customer.lastName}</strong>! Your order is being printed with care.
          </p>

          {/* Order Details Card */}
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 text-left mb-6 text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between border-b border-zinc-200/60 pb-2">
              <span className="text-zinc-500">Order ID</span>
              <span className="font-extrabold text-zinc-900 font-mono">{orderComplete.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200/60 pb-2">
              <span className="text-zinc-500">Shipping To</span>
              <span className="font-bold text-zinc-800 text-right">
                {orderComplete.customer.address}, {orderComplete.customer.city} - {orderComplete.customer.pincode} ({orderComplete.customer.state})
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200/60 pb-2">
              <span className="text-zinc-500">Phone</span>
              <span className="font-bold text-zinc-800">{orderComplete.customer.phone}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-500 font-bold">Total Paid</span>
              <span className="font-black text-zinc-950 text-base">INR ₹{orderComplete.total}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3 mb-8 text-left">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Ordered Items</h3>
            {orderComplete.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white border border-zinc-100 p-2.5 rounded-xl">
                <img src={item.image} alt={item.title} className="w-12 h-16 object-contain bg-zinc-50 rounded-lg p-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-zinc-500">{item.model}</p>
                  {item.wording && <p className="text-[10px] text-emerald-600 font-bold">{item.wording}</p>}
                </div>
                <div className="text-xs font-bold text-zinc-900">
                  Qty: {item.quantity} • ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer shadow-md"
            >
              Continue Shopping
            </button>
            <a
              href={`https://wa.me/919876543210?text=Hello%20PRAVAR%20WRAPS!%20I%20just%20placed%20order%20${orderComplete.orderId}.%20Kindly%20confirm%20my%20order!`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle size={16} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-20 w-full pt-6 sm:pt-8">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage('cart')}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={15} /> Back to Cart
          </button>
        </div>

        {/* TOP TRUST BADGES BAR - Matching Screenshot 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {/* Card 1: 50,000+ Happy Customers */}
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Heart size={20} className="fill-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">50,000+</div>
              <div className="text-[11px] text-zinc-600 font-medium leading-tight">Happy Customers ❤️</div>
            </div>
          </div>

          {/* Card 2: 59K+ Instagram Followers */}
          <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">59K+</div>
              <div className="text-[11px] text-zinc-600 font-medium leading-tight">Instagram Followers 👥</div>
            </div>
          </div>

          {/* Card 3: Trusted Since 2018 */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Star size={20} className="fill-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">Trusted</div>
              <div className="text-[11px] text-zinc-600 font-medium leading-tight">Since 2018 ⭐</div>
            </div>
          </div>

          {/* Card 4: Made in Tamil Nadu */}
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
              <Zap size={20} className="fill-zinc-900" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">Made in</div>
              <div className="text-[11px] text-zinc-600 font-medium leading-tight">Tamil Nadu ❤️</div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN CHECKOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT COLUMN: Delivery, Shipping, Payment */}
          <form onSubmit={handlePayNow} className="lg:col-span-7 xl:col-span-7 space-y-8">
            {/* DELIVERY SECTION */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-4">
                Delivery
              </h2>

              <div className="space-y-3.5">
                {/* Country */}
                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm cursor-pointer"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                {/* First name & Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name (optional)"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400"
                  />
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400 ${
                        errors.lastName ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'
                      }`}
                    />
                    {errors.lastName && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400 ${
                      errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.address}</p>}
                </div>

                {/* Apartment, suite (optional) */}
                <div>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400"
                  />
                </div>

                {/* PIN Code, City, State */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="PIN code"
                      maxLength={6}
                      className={`w-full bg-white border rounded-xl px-3 sm:px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400 ${
                        errors.pincode ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'
                      }`}
                    />
                    {errors.pincode && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.pincode}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full bg-white border rounded-xl px-3 sm:px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400 ${
                        errors.city ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'
                      }`}
                    />
                    {errors.city && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.city}</p>}
                  </div>

                  <div>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-2 sm:px-4 py-3.5 text-xs sm:text-sm text-zinc-800 font-medium focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm cursor-pointer"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Other States">Other States</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    maxLength={10}
                    className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400 ${
                      errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-zinc-200'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.phone}</p>}
                </div>

                {/* Alternate phone (optional) */}
                <div>
                  <input
                    type="tel"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    placeholder="Alternate phone (optional)"
                    maxLength={10}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm placeholder:text-zinc-400"
                  />
                </div>

                {/* Save info checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                  />
                  <label htmlFor="saveInfo" className="text-xs text-zinc-600 cursor-pointer">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            {/* SHIPPING METHOD SECTION - Matching Screenshot 3 */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-3">
                Shipping method
              </h2>

              <div className="bg-zinc-50/80 border border-zinc-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-zinc-900 block">
                    {isTN ? 'Free Shipping (Tamil Nadu)' : 'Standard Door Delivery Across India'}
                  </span>
                  <span className="text-xs text-zinc-500 mt-0.5 block">
                    Fast courier dispatch with tracking link sent on WhatsApp & SMS.
                  </span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700">
                  {isTN ? 'Free' : '₹49'}
                </span>
              </div>
            </div>

            {/* PAYMENT SECTION - Matching Screenshot 3 */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-1">
                Payment
              </h2>
              <p className="text-xs text-zinc-500 mb-4">
                All transactions are secure and encrypted.
              </p>

              {/* Razorpay Secure Container */}
              <div className="border-2 border-zinc-900 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-zinc-50 p-4 sm:p-5 flex items-center justify-between border-b border-zinc-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="razorpay"
                      name="paymentMethod"
                      checked={true}
                      readOnly
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                    />
                    <label htmlFor="razorpay" className="text-xs sm:text-sm font-bold text-zinc-900 cursor-pointer">
                      Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)
                    </label>
                  </div>

                  {/* Payment Icons */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded">UPI</span>
                    <span className="text-[10px] font-black bg-blue-700 text-white px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[10px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded">MC</span>
                    <span className="text-[10px] text-zinc-400 font-bold hidden sm:inline">+18</span>
                  </div>
                </div>

                <div className="p-6 text-center bg-white">
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-zinc-700">
                    <CreditCard size={24} />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                    You'll be redirected to Razorpay Secure (UPI, Cards, Int'l Cards, Wallets) to complete your purchase.
                  </p>
                </div>
              </div>
            </div>

            {/* PAY NOW BUTTON */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-extrabold py-4 rounded-full text-base sm:text-lg transition-all shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <span>Pay now</span>
                )}
              </button>
            </div>

            {/* YELLOW DOUBT BANNER - Matching Screenshot 3 */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">😊</span>
                <p className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed">
                  Online payment la doubt ah? <strong className="text-rose-600">Instagram reviews</strong> check pannunga illa <strong className="text-emerald-700">WhatsApp</strong> la message pannunga. Nambikkai oda order pannunga ❤️
                </p>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Reviews"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a
                  href="https://wa.me/919876543210?text=Hello%20PRAVAR%20WRAPS!%20I%20have%20a%20doubt%20about%20ordering."
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Support"
                  className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </form>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-5 sticky top-24">
            <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-5">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {/* Thumbnail with Quantity Badge */}
                    <div className="relative w-16 aspect-[3/4] bg-white border border-zinc-200 rounded-xl p-1 shrink-0 flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                      <span className="absolute -top-2 -right-2 bg-zinc-700 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                        {item.title}
                      </h4>
                      {item.model && (
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          Choose Your Phone Model: {item.model}
                        </p>
                      )}
                      {item.wording && (
                        <p className="text-[11px] text-emerald-600 font-bold truncate mt-0.5">
                          MURUGAN WORDINGS: {item.wording}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right text-xs sm:text-sm font-bold text-zinc-900 shrink-0">
                      ₹{(Number(item.price) || 499) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Row */}
              <div className="flex gap-2 mb-6 pt-4 border-t border-zinc-200">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon codes temporarily disabled"
                  disabled={true}
                  className="flex-1 bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={true}
                  className="bg-zinc-200 text-zinc-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 pt-2 border-t border-zinc-200">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-700">
                    {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-3 flex justify-between items-center text-base font-black text-zinc-950">
                  <span>Total</span>
                  <span>INR ₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
