import React, { useState, useRef, useEffect } from 'react';
import { Share2, ChevronLeft, Check, ChevronDown, Search, Upload, Image as ImageIcon, X } from 'lucide-react';
import { PHONE_MODELS_BY_BRAND } from './phoneModelsData';
import { getStoredCategories, fetchCategoriesFromApi, compressImage } from './categoryData';

const SearchableSelect = ({ optionsByBrand, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = Object.entries(optionsByBrand).reduce((acc, [brand, models]) => {
    const matched = models.filter(m => m.toLowerCase().includes(search.toLowerCase()));
    if (matched.length > 0) {
      acc.push({ brand, models: matched });
    }
    return acc;
  }, []);

  return (
    <div className="relative w-full mb-3" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-700 focus:outline-none focus:border-zinc-900 shadow-sm font-medium cursor-pointer flex justify-between items-center"
      >
        <span>{value || "-- Choose your phone model --"}</span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full top-full mt-2 left-0 bg-white border border-zinc-200 rounded-xl shadow-xl max-h-[350px] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-zinc-100 shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                autoFocus
                placeholder="Search your model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto p-2 scrollbar-thin bg-white">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ brand, models }) => (
                <div key={brand} className="mb-2 last:mb-0">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-3 py-1.5 bg-zinc-50/50 rounded-md mb-1">
                    {brand} ({models.length})
                  </div>
                  {models.map(model => (
                    <div
                      key={model}
                      onClick={() => {
                        onChange(model);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${value === model
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                    >
                      {model}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">
                No models found matching "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Product({
  selectedProduct,
  selectedCategory,
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
  const [categoriesList, setCategoriesList] = useState(getStoredCategories);

  useEffect(() => {
    // 1. Initial cached state
    setCategoriesList(getStoredCategories());
    // 2. Fetch live data from backend
    fetchCategoriesFromApi().then(cats => {
      if (Array.isArray(cats) && cats.length > 0) {
        setCategoriesList(cats);
      }
    });
  }, [selectedProduct, selectedCategory]);

  const isEnabled = (val) => val === true || val === 'true' || val === 1 || val === '1';

  // 1. Direct check on product
  let hasTwoPhotos = isEnabled(selectedProduct?.hasTwoPhotos);

  // 2. Direct check on passed selectedCategory
  if (!hasTwoPhotos && selectedCategory) {
    hasTwoPhotos = isEnabled(selectedCategory.hasTwoPhotos);
  }

  // 3. Search category by all possible identifiers
  if (!hasTwoPhotos) {
    const catsToSearch = categoriesList.length > 0 ? categoriesList : getStoredCategories();
    const matchedCategory = catsToSearch.find(c => {
      if (!c) return false;
      // Match by categoryId on product
      if (selectedProduct?.categoryId && (c.id === selectedProduct.categoryId || String(c.id) === String(selectedProduct.categoryId))) {
        return true;
      }
      // Match by category title / category field
      const pCat = selectedProduct?.category || selectedProduct?.categoryTitle;
      if (pCat && c.title && c.title.trim().toLowerCase() === pCat.trim().toLowerCase()) {
        return true;
      }
      // Match by category slug
      if (selectedProduct?.categorySlug && c.slug && c.slug.toLowerCase() === selectedProduct.categorySlug.toLowerCase()) {
        return true;
      }
      // Match by selectedCategory id or slug
      if (selectedCategory?.id && (c.id === selectedCategory.id || String(c.id) === String(selectedCategory.id))) {
        return true;
      }
      if (selectedCategory?.slug && c.slug && c.slug.toLowerCase() === selectedCategory.slug.toLowerCase()) {
        return true;
      }
      // Match if product title contains the category title
      if (c.title && selectedProduct?.title && selectedProduct.title.toLowerCase().includes(c.title.trim().toLowerCase())) {
        return true;
      }
      return false;
    });

    if (matchedCategory) {
      hasTwoPhotos = isEnabled(matchedCategory.hasTwoPhotos);
    }
  }

  // Check if this product's category has the Gold Plate / Print option enabled
  let hasGoldPlate = isEnabled(selectedProduct?.hasGoldPlate);
  if (!hasGoldPlate && selectedCategory) {
    hasGoldPlate = isEnabled(selectedCategory.hasGoldPlate);
  }
  if (!hasGoldPlate) {
    const catsToSearch = categoriesList.length > 0 ? categoriesList : getStoredCategories();
    const matchedCategory = catsToSearch.find(c => {
      if (!c) return false;
      if (selectedProduct?.categoryId && (c.id === selectedProduct.categoryId || String(c.id) === String(selectedProduct.categoryId))) {
        return true;
      }
      const pCat = selectedProduct?.category || selectedProduct?.categoryTitle;
      if (pCat && c.title && c.title.trim().toLowerCase() === pCat.trim().toLowerCase()) {
        return true;
      }
      if (selectedProduct?.categorySlug && c.slug && c.slug.toLowerCase() === selectedProduct.categorySlug.toLowerCase()) {
        return true;
      }
      if (selectedCategory?.id && (c.id === selectedCategory.id || String(c.id) === String(selectedCategory.id))) {
        return true;
      }
      if (selectedCategory?.slug && c.slug && c.slug.toLowerCase() === selectedCategory.slug.toLowerCase()) {
        return true;
      }
      if (c.title && selectedProduct?.title && selectedProduct.title.toLowerCase().includes(c.title.trim().toLowerCase())) {
        return true;
      }
      return false;
    });

    if (matchedCategory) {
      hasGoldPlate = isEnabled(matchedCategory.hasGoldPlate);
    }
  }

  // State for Gold Plate / Print Option
  const [customPlateText, setCustomPlateText] = useState('');
  const [selectedTextOption, setSelectedTextOption] = useState('gold'); // 'gold' (Gold Plate) | 'print' (Print)
  const goldPlateSurcharge = (hasGoldPlate && selectedTextOption === 'gold') ? 99 : 0;
  const effectivePrice = (Number(currentPrice) || 499) + goldPlateSurcharge;

  // State for 2 Photos & Custom Texts
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isUploadingPhoto1, setIsUploadingPhoto1] = useState(false);
  const [isUploadingPhoto2, setIsUploadingPhoto2] = useState(false);

  const handlePhotoUpload = async (e, photoNum) => {
    const file = e.target.files[0];
    if (!file) return;
    if (photoNum === 1) setIsUploadingPhoto1(true);
    else setIsUploadingPhoto2(true);

    try {
      const compressed = await compressImage(file, 1200, 0.85);
      if (photoNum === 1) setPhoto1(compressed);
      else setPhoto2(compressed);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to process image. Please try again.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      if (photoNum === 1) setIsUploadingPhoto1(false);
      else setIsUploadingPhoto2(false);
    }
  };

  const isMuruganProduct = currentTitle.toLowerCase().includes('murug');

  const validateOptions = () => {
    if (!selectedModel) {
      setFeedbackMsg({ type: 'error', text: '⚠️ Please choose your phone model first!' });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return false;
    }
    if (hasTwoPhotos) {
      if (!photo1) {
        setFeedbackMsg({ type: 'error', text: '⚠️ Please upload Photo 1 to proceed!' });
        setTimeout(() => setFeedbackMsg(null), 3500);
        return false;
      }
      if (!photo2) {
        setFeedbackMsg({ type: 'error', text: '⚠️ Please upload Photo 2 to proceed!' });
        setTimeout(() => setFeedbackMsg(null), 3500);
        return false;
      }
    }
    return true;
  };

  const buildCartItem = () => {
    return {
      id: `${selectedProduct?.id || currentTitle}-${selectedModel}-${selectedTextOption}-${customPlateText}-${wording}-${Date.now()}`,
      title: currentTitle,
      image: currentImage,
      price: effectivePrice,
      basePrice: currentPrice,
      oldPrice: currentOldPrice,
      model: selectedModel,
      wording: wording || null,
      photo1: photo1 || null,
      photo2: photo2 || null,
      text1: text1?.trim() || null,
      text2: text2?.trim() || null,
      hasTwoPhotos,
      hasGoldPlate,
      goldOption: hasGoldPlate ? (selectedTextOption === 'gold' ? 'Gold Plate (+₹99)' : 'Print (Free)') : null,
      customPlateText: hasGoldPlate ? (customPlateText?.trim() || null) : null,
      customText: hasGoldPlate ? (customPlateText?.trim() || null) : null,
      platePrice: goldPlateSurcharge,
      quantity: 1
    };
  };

  const handleAddToCart = () => {
    if (!validateOptions()) return;
    const item = buildCartItem();
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleBuyNow = () => {
    if (!validateOptions()) return;
    const item = buildCartItem();
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
            onClick={() => setCurrentPage && setCurrentPage('categories')}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to Categories
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
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-2xl font-black text-zinc-900">₹{effectivePrice}</span>
                  {goldPlateSurcharge > 0 && (
                    <span className="text-[10px] sm:text-[11px] font-black text-amber-600 tracking-wider uppercase">
                      INCL. +₹99 PLATE
                    </span>
                  )}
                  <span className="text-lg text-zinc-400 line-through">₹{currentOldPrice}</span>
                  <span className="text-sm font-bold text-green-500">{currentOff}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 mb-6">Free shipping within Tamil Nadu only. Additional charges (Door Delivery) apply for other states.</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: currentTitle, url: window.location.href }).catch(() => { });
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
              <div className={`p-3.5 mb-6 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${feedbackMsg.type === 'error'
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

              <SearchableSelect
                optionsByBrand={PHONE_MODELS_BY_BRAND}
                value={selectedModel}
                onChange={setSelectedModel}
              />

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

            {/* GOLD PLATE / PRINT OPTION (Only shown when category has hasGoldPlate enabled) */}
            {hasGoldPlate && (
              <div className="bg-zinc-50/80 rounded-2xl p-5 sm:p-6 mb-8 border border-zinc-200/90 shadow-sm space-y-5">
                {/* 1. IF ANY TEXT NEED TYPE HERE (optional) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">
                    IF ANY TEXT NEED TYPE HERE <span className="text-zinc-400 font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. gobi"
                    value={customPlateText}
                    onChange={(e) => setCustomPlateText(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-sm transition-all"
                  />
                </div>

                {/* 2. Text: Gold Plate / Print selector */}
                <div>
                  <div className="text-xs font-bold text-zinc-900 mb-3">
                    Text: Gold Plate / Print {selectedTextOption === 'gold' && <span className="text-amber-800 font-extrabold">(+₹99)</span>}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Option 1: Gold Plate (+₹99) */}
                    <div
                      onClick={() => setSelectedTextOption('gold')}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl p-1 flex items-center justify-center transition-all ${
                          selectedTextOption === 'gold'
                            ? 'border-2 border-zinc-950 shadow-md ring-2 ring-zinc-900/10'
                            : 'border border-zinc-200 hover:border-zinc-400 bg-white'
                        }`}
                      >
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-400 flex items-center justify-center shadow-inner">
                          <span className="font-serif font-black text-amber-950 text-xs italic tracking-wider drop-shadow-xs">
                            Text
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${selectedTextOption === 'gold' ? 'text-zinc-950 font-black' : 'text-zinc-600'}`}>
                        Gold Plate
                      </span>
                    </div>

                    {/* Option 2: Print (Free) */}
                    <div
                      onClick={() => setSelectedTextOption('print')}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl p-1 flex items-center justify-center transition-all ${
                          selectedTextOption === 'print'
                            ? 'border-2 border-zinc-950 shadow-md ring-2 ring-zinc-900/10'
                            : 'border border-zinc-200 hover:border-zinc-400 bg-white'
                        }`}
                      >
                        <div className="w-full h-full rounded-lg bg-white border border-zinc-200 flex items-center justify-center shadow-inner">
                          <span className="font-sans font-black text-orange-600 text-xs tracking-wider">
                            Text
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${selectedTextOption === 'print' ? 'text-zinc-950 font-black' : 'text-zinc-600'}`}>
                        Print
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2 PHOTOS & CUSTOM TEXT UPLOAD (Only shown when category has hasTwoPhotos enabled) */}
            {hasTwoPhotos && (
              <div className="space-y-5 mb-8">
                {/* UPLOAD YOUR 2 PHOTOS CARD */}
                <div className="bg-zinc-50/80 rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="w-4 h-4 text-zinc-900" />
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 uppercase tracking-wider">
                      UPLOAD YOUR 2 PHOTOS
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mb-5">
                    This Magic Case needs 2 photos to print — both are required.
                  </p>

                  {/* PHOTO 1 */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                        PHOTO 1
                      </label>
                      {photo1 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Photo 1 Added
                        </span>
                      )}
                    </div>

                    {photo1 ? (
                      <div className="relative border border-zinc-200 rounded-2xl p-3 bg-white flex items-center gap-4 shadow-sm">
                        <img src={photo1} alt="Uploaded Photo 1" className="w-20 h-24 object-cover rounded-xl border border-zinc-200 shadow-sm" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900">Photo 1 selected</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Ready for high-res print</p>
                          <label className="inline-block mt-2 text-xs font-bold text-zinc-900 underline cursor-pointer hover:text-black">
                            Change photo
                            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 1)} className="hidden" />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhoto1(null)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white hover:bg-zinc-50 shadow-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 1)}
                          className="hidden"
                        />
                        <ImageIcon className="w-6 h-6 text-zinc-400 mb-2" />
                        <span className="text-xs font-bold text-zinc-800">
                          {isUploadingPhoto1 ? 'Processing photo 1...' : 'Tap to choose photo 1'}
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">JPG or PNG, up to 5MB</span>
                      </label>
                    )}
                  </div>

                  {/* PHOTO 2 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                        PHOTO 2
                      </label>
                      {photo2 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Photo 2 Added
                        </span>
                      )}
                    </div>

                    {photo2 ? (
                      <div className="relative border border-zinc-200 rounded-2xl p-3 bg-white flex items-center gap-4 shadow-sm">
                        <img src={photo2} alt="Uploaded Photo 2" className="w-20 h-24 object-cover rounded-xl border border-zinc-200 shadow-sm" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900">Photo 2 selected</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Ready for high-res print</p>
                          <label className="inline-block mt-2 text-xs font-bold text-zinc-900 underline cursor-pointer hover:text-black">
                            Change photo
                            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 2)} className="hidden" />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhoto2(null)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white hover:bg-zinc-50 shadow-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 2)}
                          className="hidden"
                        />
                        <ImageIcon className="w-6 h-6 text-zinc-400 mb-2" />
                        <span className="text-xs font-bold text-zinc-800">
                          {isUploadingPhoto2 ? 'Processing photo 2...' : 'Tap to choose photo 2'}
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">JPG or PNG, up to 5MB</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* TEXT 1 & TEXT 2 (OPTIONAL) */}
                <div className="bg-zinc-50/80 rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      TEXT 1 (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya"
                      value={text1}
                      onChange={(e) => setText1(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 outline-none focus:border-zinc-900 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      TEXT 2 (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kumar"
                      value={text2}
                      onChange={(e) => setText2(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 outline-none focus:border-zinc-900 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black border-2 border-black font-bold py-4 rounded-full text-[15px] hover:bg-zinc-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white font-bold py-4 rounded-full text-[15px] hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
