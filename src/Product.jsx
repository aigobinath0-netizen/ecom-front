import React, { useState } from 'react';
import { Share2, ChevronLeft, Check } from 'lucide-react';
import { PHONE_MODELS_BY_BRAND } from './phoneModelsData';

export default function Product({ 
  selectedProduct, 
  setCurrentPage, 
  onAddToCart, 
  onBuyNow 
}) {
  const currentTitle = selectedProduct?.title || "Murugar Acrylic glass case";
  const currentImage = selectedProduct?.image || "/images/12857815f64121652110d55a.jpg";
  const currentPrice = selectedProduct?.price || 499;
  const currentOldPrice = selectedProduct?.oldPrice || 999;
  const currentOff = selectedProduct?.off || "50% off";

  const [mainImage, setMainImage] = useState(currentImage);
  const [selectedModel, setSelectedModel] = useState('');
  const [wording, setWording] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const isMuruganProduct = currentTitle.toLowerCase().includes('murug');

  const handleAddToCart = () => {
    if (!selectedModel) {
      setFeedbackMsg({ type: 'error', text: '⚠️ Please choose your phone model first!' });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }
    const item = {
      id: `${selectedProduct?.id || currentTitle}-${selectedModel}-${wording}-${Date.now()}`,
      title: currentTitle,
      image: currentImage,
      price: currentPrice,
      oldPrice: currentOldPrice,
      model: selectedModel,
      wording: wording || null,
      quantity: 1
    };
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleBuyNow = () => {
    if (!selectedModel) {
      setFeedbackMsg({ type: 'error', text: '⚠️ Please choose your phone model first!' });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }
    const item = {
      id: `${selectedProduct?.id || currentTitle}-${selectedModel}-${wording}-${Date.now()}`,
      title: currentTitle,
      image: currentImage,
      price: currentPrice,
      oldPrice: currentOldPrice,
      model: selectedModel,
      wording: wording || null,
      quantity: 1
    };
    if (onBuyNow) {
      onBuyNow(item);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pt-6 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-20 w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage && setCurrentPage('collection')}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to Collection
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column - Images */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full max-w-lg aspect-[3/4] bg-white border border-zinc-100 rounded-3xl p-6 flex items-center justify-center shadow-sm">
              <img src={mainImage} alt={currentTitle} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setMainImage(currentImage)} 
                className="w-20 h-24 border-2 rounded-xl overflow-hidden border-zinc-900 flex items-center justify-center p-1 bg-white cursor-pointer"
              >
                <img src={currentImage} alt="Thumb 1" className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">{currentTitle}</h1>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-black text-zinc-900">₹{currentPrice}</span>
                  <span className="text-lg text-zinc-400 line-through">₹{currentOldPrice}</span>
                  <span className="text-sm font-bold text-green-500">{currentOff}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 mb-6">Free shipping within Tamil Nadu only. Additional charges (Door Delivery) apply for other states.</p>
              </div>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: currentTitle, url: window.location.href }).catch(() => {});
                  }
                }}
                className="w-12 h-12 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-700 hover:bg-zinc-50 shrink-0 shadow-sm transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Notification / Toast Message */}
            {feedbackMsg && (
              <div className={`p-3.5 mb-6 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                feedbackMsg.type === 'error' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* SINGLE CLEAN CHOOSE YOUR PHONE MODEL DROPDOWN */}
            <div className="bg-zinc-50/80 rounded-2xl p-6 mb-6 border border-zinc-100">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  CHOOSE YOUR PHONE MODEL
                </label>
                {selectedModel && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>

              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-700 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 mb-3 appearance-none cursor-pointer shadow-sm font-medium"
              >
                <option value="">-- Choose your phone model --</option>
                {Object.entries(PHONE_MODELS_BY_BRAND).map(([brand, models]) => (
                  <optgroup key={brand} label={`━━━ ${brand.toUpperCase()} (${models.length}) ━━━`}>
                    {models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <p className="text-xs text-zinc-500">
                If your model is not found, kindly message us on WhatsApp.
              </p>
            </div>

            {/* MURUGAN WORDINGS (optional) - Only shown on Murugan products */}
            {isMuruganProduct && (
              <div className="bg-zinc-50/80 rounded-2xl p-6 mb-8 border border-zinc-100">
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
                  MURUGAN WORDINGS (optional)
                </label>
                <select 
                  value={wording}
                  onChange={(e) => setWording(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 appearance-none cursor-pointer"
                >
                  <option value="">-- Choose MURUGAN WORDINGS (optional) --</option>
                  <option value="Om Muruga">Om Muruga</option>
                  <option value="Vetri Vel Veer Vel">Vetri Vel Veer Vel</option>
                  <option value="ஓம் சரவணபவ">ஓம் சரவணபவ</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#1a1a1a] text-white font-bold py-4 rounded-full text-[15px] hover:bg-black transition-colors shadow-lg shadow-zinc-900/20 cursor-pointer flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-900 font-bold py-4 rounded-full text-[15px] hover:from-amber-500 hover:to-amber-600 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-zinc-600 leading-relaxed mb-12">
              <p>Protect your phone with confidence using our Premium Mobile Case, crafted from high-quality materials for long-lasting durability. Designed with reinforced edge protection, it absorbs shocks and helps safeguard your device from accidental drops and impacts. The precise fit ensures easy access to all buttons and ports while maintaining a sleek, stylish look. Its anti-slip grip offers comfortable handling and added security in everyday use. Built for both protection and elegance, this case keeps your phone safe without compromising on style.</p>
            </div>

            {/* Material Details */}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-6">MATERIAL DETAILS</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-[280px] rounded-2xl overflow-hidden shrink-0">
                  <img src="/images/b87cc8af278adb5833b5b6b1.jpg" alt="Material" className="w-full h-auto object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-600 leading-relaxed pt-2">
                    Your memories deserve nothing less than perfection. Our Strong Acrylic Case is printed using advanced Ultra HD UV printing technology.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
