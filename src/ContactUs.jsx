import React from 'react';
import { Mail, PhoneCall, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactUs() {

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb]">
      {/* Hero Section */}
      <div className="relative bg-zinc-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md">
            <MessageSquare className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Let's Start a Conversation
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about your order, shipping, or a custom design? Our team is ready to help you create the perfect mobile case.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-8 sm:-mt-12 relative z-10">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 sm:mb-16">
          {/* Card 1: Email */}
          <a href="mailto:Ponthamil26@gmail.com" className="group bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-zinc-200/40 border border-zinc-100 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">Email Us</h3>
            <p className="text-zinc-500 text-[13px] mb-4">We usually respond within 24 hours.</p>
            <span className="text-amber-500 font-bold text-[13px] sm:text-sm mt-auto break-all">Ponthamil26@gmail.com</span>
          </a>

          {/* Card 2: Phone */}
          <div className="group bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-zinc-200/40 border border-zinc-100 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">Call Us</h3>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold uppercase tracking-wider mb-4 bg-zinc-50 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" /> 10 AM – 5 PM
            </div>
            <div className="flex flex-col gap-1 mt-auto">
              <a href="tel:+918825544004" className="text-zinc-900 font-bold text-[13px] sm:text-sm hover:text-blue-500 transition-colors">+91 88255 44004</a>
              <a href="tel:+917708155630" className="text-zinc-900 font-bold text-[13px] sm:text-sm hover:text-blue-500 transition-colors">+91 77081 55630</a>
            </div>
          </div>

          {/* Card 3: Location */}
          <a href="https://maps.app.goo.gl/RFm6MfcBsEBwGaeT7?g_st=iw" target="_blank" rel="noopener noreferrer" className="group bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-zinc-200/40 border border-zinc-100 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">Visit Us</h3>
            <p className="text-zinc-500 text-[13px] mb-4">Come see our premium cases in person.</p>
            <span className="text-emerald-500 font-bold text-[13px] sm:text-sm mt-auto">Distributor Salem,<br/>Poonthamil</span>
          </a>
        </div>

        {/* Advanced Section: Map & Connect */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Map Section */}
          <div className="flex-1 bg-white p-2 sm:p-3 rounded-3xl sm:rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-zinc-100 overflow-hidden group">
            <div className="relative w-full h-[300px] lg:h-full min-h-[350px] rounded-[1.25rem] sm:rounded-[1.5rem] overflow-hidden">
              {/* Overlay for map to make it look premium until hovered */}
              <div className="absolute inset-0 bg-zinc-950/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15629.544773127814!2d78.1408!3d11.6664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf1c4e95146bf%3A0x6b633917822d64a0!2sSalem%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1714488390772!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Our Location</span>
              </div>
            </div>
          </div>

          {/* Socials & Process */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            {/* Social Block */}
            <div className="bg-zinc-950 p-8 rounded-3xl sm:rounded-[2rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-center min-h-[160px] group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-5">Connect With Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg border border-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Process Info */}
            <div className="bg-white p-8 rounded-3xl sm:rounded-[2rem] shadow-xl shadow-zinc-200/40 border border-zinc-100 flex-1 flex flex-col justify-center">
              <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-6">Our Support Process</h3>
              
              <div className="flex gap-4 mb-6 relative">
                <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-zinc-100"></div>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10 text-xs">1</div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Reach Out</h4>
                  <p className="text-[13px] text-zinc-500">Call or email us anytime.</p>
                </div>
              </div>
              
              <div className="flex gap-4 mb-6 relative">
                <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-zinc-100"></div>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10 text-xs">2</div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">We Review</h4>
                  <p className="text-[13px] text-zinc-500">Our team looks into your inquiry.</p>
                </div>
              </div>
              
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10 text-xs">3</div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Fast Resolution</h4>
                  <p className="text-[13px] text-zinc-500">Solved within 24 business hours.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
