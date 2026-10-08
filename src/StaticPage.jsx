import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StaticPage({ title }) {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 w-full flex-1 bg-white">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 font-bold transition-colors">
        <ArrowLeft size={20} /> Back
      </button>
      <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 uppercase tracking-widest mb-6">{title}</h1>
        <div className="max-w-2xl mx-auto text-zinc-500 text-sm sm:text-base leading-relaxed">
          <p>We are currently updating our <b>{title}</b>.</p>
          <p className="mt-4">Please check back soon for the latest information. If you have any immediate questions, feel free to visit our Contact Us page.</p>
        </div>
      </div>
    </div>
  );
}
