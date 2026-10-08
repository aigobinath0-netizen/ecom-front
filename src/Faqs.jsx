import React, { useState } from 'react';
import { Info, CreditCard, Truck, ShoppingCart, Tag, Wand2, RotateCcw, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function Faqs() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openQuestionIdx, setOpenQuestionIdx] = useState(0);

  const categories = [
    { id: 'about', title: 'About Stickover', count: 8, icon: Info },
    { id: 'payment', title: 'Payment and Security', count: 5, icon: CreditCard },
    { id: 'shipping', title: 'Shipping and Delivery', count: 5, icon: Truck },
    { id: 'order', title: 'How to Place Order?', count: 5, icon: ShoppingCart },
    { id: 'coupons', title: 'Coupons and Offers', count: 3, icon: Tag },
    { id: 'customization', title: 'Product Customization', count: 5, icon: Wand2 },
    { id: 'returns', title: 'Cancellation and Returns', count: 4, icon: RotateCcw },
  ];

  const faqData = {
    'about': [
      { q: 'How long does delivery take?', a: 'Orders are usually delivered within 4-7 business days across India.' },
      { q: 'Who is Stickover and what do you sell?', a: 'Stickover is a custom phone case and sticker store — we design, print, and ship personalised phone cases (acrylic, glass, gold-finish and more) and custom stickers pan-India.' },
      { q: 'Do you offer Cash on Delivery?', a: 'Yes, all orders currently support Cash on Delivery (COD).' },
      { q: 'Where is Stickover based?', a: 'We are based in Avinashi, Tiruppur, Tamil Nadu, and we ship orders across India.' },
      { q: 'Can I return or exchange my order?', a: 'Yes, please check our Returns & Exchange policy page for details.' },
      { q: 'How long has Stickover been making custom cases?', a: 'We have been crafting customised acrylic and gold phone cases for over 5 years, focused on durability and print quality.' },
      { q: 'Does Stickover only make phone cases?', a: 'Phone cases are our main product, but we also print custom stickers and a few personalised accessories — check our Collections page for the full range.' },
      { q: 'How can I stay updated on new designs?', a: 'Follow us on Instagram or subscribe to our newsletter from the homepage footer — new arrivals are posted there first.' }
    ],
    'payment': [
      { q: 'What payment options are available?', a: 'We accept UPI, credit/debit cards, net banking, and popular wallets via Razorpay, plus Cash on Delivery on eligible pincodes.' },
      { q: 'Are online transactions secure?', a: 'Yes, all payments are processed through Razorpay with bank-grade encryption — we never store your card details.' },
      { q: 'What should I do if a payment fails?', a: 'If the amount was deducted but the order was not confirmed, it is usually auto-refunded within 5-7 business days. Contact us if it takes longer.' },
      { q: 'How will I get my refund amount?', a: 'Refunds are credited back to the original payment method within 5-7 business days after approval.' },
      { q: 'My bank charged me twice for one order, what should I do?', a: 'Please share your order ID and payment reference with our support team — we will verify with Razorpay and refund any duplicate charge.' }
    ],
    'shipping': [
      { q: 'Do you ship all over India?', a: 'Yes, we deliver pan-India via trusted courier partners.' },
      { q: 'What are the shipping charges?', a: 'Shipping is completely free on every order, no matter how small — even a ₹1 order ships free.' },
      { q: 'Can I change my delivery address after placing the order?', a: 'If the order has not yet shipped, contact us immediately and we will try to update the address.' },
      { q: 'What if I am not available when the courier delivers?', a: 'The courier will usually attempt redelivery 1-2 more times; you can also coordinate a convenient time via the tracking link.' },
      { q: 'Do you ship internationally?', a: 'Currently we only ship within India.' }
    ],
    'order': [
      { q: 'What is the process to place an order?', a: 'Pick a case, choose your phone model, customize it if needed, add to cart, and checkout with your address and payment details.' },
      { q: 'How much time will it take to receive my order?', a: 'Orders are typically dispatched within 2-3 business days and delivered within 5-7 days depending on your location.' },
      { q: 'Can I add more items to an order I already placed?', a: 'Once an order is placed it usually starts processing quickly, so please place a new order for additional items or contact us right away.' },
      { q: 'I cannot track my order — what should I do?', a: 'Use the Track Order page with your order ID, or contact our support team with your registered phone number.' },
      { q: 'Do I need an account to place an order?', a: 'No, you can checkout as a guest, though creating an account makes it easier to track past orders.' }
    ],
    'coupons': [
      { q: 'How do I apply a coupon code?', a: 'Enter your coupon code in the cart or checkout page before placing the order to see the discount applied.' },
      { q: 'Why is my coupon code not working?', a: 'Check the coupon\'s minimum order value and validity — expired or restricted codes will show an error at checkout.' },
      { q: 'Can I combine multiple coupons on one order?', a: 'Only one coupon can be applied per order.' }
    ],
    'customization': [
      { q: 'What is Product Customization?', a: 'On customizable products, you can upload your own photo or type a name, and we print it directly onto the case exactly as previewed.' },
      { q: 'What happens if I upload a low quality photo?', a: 'If the image resolution is too low, the print may look blurry or pixelated. We recommend uploading photos at least 1000x1000px for a sharp result.' },
      { q: 'Will I see a preview before my case is printed?', a: 'Yes — the customization tool shows a live preview of your photo or name on the case before you add it to cart.' },
      { q: 'Can I customize any phone model?', a: 'Most of our cases support a wide range of phone models — select your brand and model on the product page to see availability.' },
      { q: 'Can I request a fully custom design not shown on the site?', a: 'Yes, reach out via Contact Us or WhatsApp with your design idea and we will let you know if it is possible.' }
    ],
    'returns': [
      { q: 'Can I cancel my order any time?', a: 'Since our products are custom-printed, cancellation is only possible before we start processing — please call us as soon as possible after ordering.' },
      { q: 'Can I get a replacement or refund if there was a design mistake?', a: 'If the printed design doesn\'t match the preview you approved due to our error, we will replace it free of cost.' },
      { q: 'Can I get a replacement if I made a mistake in my own design?', a: 'Since these are custom products, replacements for customer-side design mistakes (wrong photo, spelling, etc.) are handled case-by-case — contact support quickly after receiving the order.' },
      { q: 'What if there is a quality mismatch with what I received?', a: 'Share photos of the received product within 48 hours of delivery and we will review it for a replacement or refund.' }
    ]
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setOpenQuestionIdx(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-widest mb-2">
            FAQ'S
          </h1>
          <p className="text-sm text-zinc-500 font-medium tracking-wide">
            ( Frequently Asked Questions )
          </p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex items-center gap-4 p-5 sm:p-6 bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-zinc-200 transition-all rounded-2xl group text-left w-full"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600 group-hover:text-amber-500 transition-colors" strokeWidth={1.5} />
                  <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-zinc-800">
                    {cat.title} <span className="text-zinc-400 font-medium">({cat.count})</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs sm:text-sm font-bold text-[#3b82f6] hover:underline flex items-center gap-1 uppercase tracking-wide"
              >
                ← FAQ / {categories.find(c => c.id === selectedCategory)?.title}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Accordion Column */}
              <div className="flex-1 bg-white border border-zinc-100 shadow-sm rounded-2xl p-6 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mb-8">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
                <div className="flex flex-col">
                  {(faqData[selectedCategory] || []).length > 0 ? (
                    faqData[selectedCategory].map((faq, idx) => (
                      <div key={idx} className="border-b border-zinc-100 last:border-0 py-4">
                        <button 
                          onClick={() => setOpenQuestionIdx(openQuestionIdx === idx ? -1 : idx)}
                          className="w-full flex items-center justify-between text-left gap-4"
                        >
                          <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                            {faq.q}
                          </span>
                          {openQuestionIdx === idx ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                          )}
                        </button>
                        {openQuestionIdx === idx && (
                          <div className="mt-3 text-sm text-zinc-600 leading-relaxed pr-8">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-zinc-500 py-4">
                      FAQ details coming soon for this category.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Links */}
              <div className="w-full lg:w-64 shrink-0">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6">More FAQ'S</h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm font-bold transition-colors text-left ${selectedCategory === cat.id ? 'text-[#3b82f6]' : 'text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      <span>{cat.title}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
