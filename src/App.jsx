import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X, Home as HomeIcon, LayoutGrid, Star } from 'lucide-react';
import Home from './Home';
import Reviews from './Reviews';
import ContactUs from './ContactUs';
import Faqs from './Faqs';
import TrackOrder from './TrackOrder';
import Collection from './Collection';
import Product from './Product';
import Cart from './Cart';
import Checkout from './Checkout';
import Footer from './Footer';
import StaticPage from './StaticPage';

import Admin from './Admin';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  let currentPage = 'home';
  if (path === '/admin') currentPage = 'admin';
  else if (path === '/collection') currentPage = 'collection';
  else if (path === '/reviews') currentPage = 'reviews';
  else if (path === '/contact') currentPage = 'contact';
  else if (path === '/faqs') currentPage = 'faqs';
  else if (path === '/track') currentPage = 'track';
  else if (path === '/product') currentPage = 'product';
  else if (path === '/cart') currentPage = 'cart';
  else if (path === '/checkout') currentPage = 'checkout';
  else if (path === '/about') currentPage = 'about';
  else if (path === '/terms') currentPage = 'terms';
  else if (path === '/privacy') currentPage = 'privacy';
  else if (path === '/shipping') currentPage = 'shipping';
  else if (path === '/cancellations') currentPage = 'cancellations';

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pravar_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('pravar_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (newItem) => {
    setCart(prev => {
      // Find if matching title, model, and wording already exists
      const existingIdx = prev.findIndex(item => 
        item.title === newItem.title && 
        item.model === newItem.model && 
        item.wording === newItem.wording
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity || 1;
        return updated;
      }
      return [newItem, ...prev];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => 
      prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const navigateTo = (page, category = null, product = null) => {
    if (category !== null) setSelectedCategory(category);
    if (product !== null) setSelectedProduct(product);
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrentPageWrapper = (page) => {
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white border-b border-zinc-200">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex items-center justify-between h-[68px] gap-3">
          <div className="flex items-center gap-1">
            <button 
              className="lg:hidden text-zinc-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-zinc-700">
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'home' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('home')}
              >
                Home
              </a>
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'collection' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('collection')}
              >
                Collections
              </a>
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'reviews' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('reviews')}
              >
                Reviews
              </a>
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'contact' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('contact')}
              >
                Contact Us
              </a>
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'faqs' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('faqs')}
              >
                FAQ's
              </a>
              <a 
                className={`cursor-pointer transition-colors ${currentPage === 'track' ? 'text-[var(--color-brand-primary)]' : 'hover:text-[var(--color-brand-primary)]'}`}
                onClick={() => navigateTo('track')}
              >
                Track Order
              </a>
            </nav>
          </div>
          <a 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer" 
            onClick={() => navigateTo('home')}
          >
            <span className="inline-flex items-center gap-3">
              <img alt="Pravar Wraps" className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full" src="/images/logo-mark-ayXhBs9R.png" />
              <span className="font-coolvetica font-black text-lg sm:text-2xl text-zinc-950 leading-none tracking-wider uppercase">PRAVAR WRAPS</span>
            </span>
            <span className="sm:hidden text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-0.5">Since 2018</span>
          </a>
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <button 
              onClick={() => navigateTo('admin')}
              title="Admin Dashboard"
              className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg transition-colors hidden sm:block"
            >
              Admin
            </button>
            <button className="text-zinc-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200">
              <Search size={22} />
            </button>
            <button 
              onClick={() => navigateTo('cart')}
              className="relative text-zinc-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200 cursor-pointer"
              title="Cart"
            >
              <ShoppingBag size={22} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative bg-white w-[80%] max-w-sm h-full flex flex-col shadow-2xl transition-transform animate-in slide-in-from-left duration-300 ease-out">
              <div className="flex items-center justify-between p-5 border-b border-zinc-100">
                <span className="font-coolvetica font-black text-2xl text-zinc-950 uppercase tracking-wide">Menu</span>
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col p-5 gap-5 text-base font-bold text-zinc-700 overflow-y-auto pb-20">
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('home'); }}>Home</a>
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('collection'); }}>Collections</a>
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('reviews'); }}>Reviews</a>
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('contact'); }}>Contact Us</a>
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('faqs'); }}>FAQ's</a>
                <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('track'); }}>Track Order</a>
                
                <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-5">
                  <a className="cursor-pointer hover:text-[var(--color-brand-primary)] flex items-center gap-3 transition-colors" onClick={() => { setIsMobileMenuOpen(false); navigateTo('admin'); }}>Admin Dashboard</a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
      <div style={{ height: '68px' }}></div>

      <main className="flex-1 flex flex-col min-h-[calc(100vh-68px)] pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={
            <Home 
              setCurrentPage={setCurrentPageWrapper} 
              onSelectCategory={(cat) => navigateTo('collection', cat)}
              onSelectProduct={(prod) => navigateTo('product', null, prod)}
            />
          } />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/collection" element={
            <Collection 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPageWrapper}
              onSelectProduct={(prod) => navigateTo('product', null, prod)}
            />
          } />
          <Route path="/product" element={
            <Product 
              selectedProduct={selectedProduct} 
              setCurrentPage={setCurrentPageWrapper}
              onAddToCart={(item) => {
                addToCart(item);
                navigateTo('cart');
              }}
              onBuyNow={(item) => {
                addToCart(item);
                navigateTo('checkout');
              }}
            />
          } />
          <Route path="/cart" element={
            <Cart 
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              setCurrentPage={setCurrentPageWrapper}
            />
          } />
          <Route path="/checkout" element={
            <Checkout 
              cart={cart}
              clearCart={clearCart}
              setCurrentPage={setCurrentPageWrapper}
            />
          } />
          <Route path="/about" element={<StaticPage title="About Us" />} />
          <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
          <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
          <Route path="/shipping" element={<StaticPage title="Shipping Policy" />} />
          <Route path="/cancellations" element={<StaticPage title="Cancellations & Refunds" />} />
          <Route path="/admin" element={
            <Admin 
              setCurrentPage={setCurrentPageWrapper}
              onSelectCategory={(cat) => navigateTo('collection', cat)}
            />
          } />
        </Routes>
        
        <Footer navigateTo={navigateTo} />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center px-2 py-3 z-40 border-t border-zinc-900">
        <button onClick={() => navigateTo('home')} className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-amber-500' : 'text-zinc-400 hover:text-white'} transition-colors w-16`}>
          <HomeIcon size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => navigateTo('collection')} className={`flex flex-col items-center gap-1 ${currentPage === 'collection' ? 'text-amber-500' : 'text-zinc-400 hover:text-white'} transition-colors w-16`}>
          <LayoutGrid size={22} />
          <span className="text-[10px] font-medium">Collections</span>
        </button>
        <button onClick={() => navigateTo('cart')} className={`relative flex flex-col items-center gap-1 ${currentPage === 'cart' ? 'text-amber-500' : 'text-zinc-400 hover:text-white'} transition-colors w-16`}>
          <div className="relative">
            <ShoppingBag size={22} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-black text-[9px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <button onClick={() => navigateTo('reviews')} className={`flex flex-col items-center gap-1 ${currentPage === 'reviews' ? 'text-amber-500' : 'text-zinc-400 hover:text-white'} transition-colors w-16`}>
          <Star size={22} />
          <span className="text-[10px] font-medium">Reviews</span>
        </button>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors w-16">
          <Menu size={22} />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

    </div>
  );
}

export default App;
