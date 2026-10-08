import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, X, Pause, Play, Layers } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stories, setStories] = useState([]);
  
  // Story viewer state
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressTimerRef = useRef(null);

  const [newReview, setNewReview] = useState({
    author: '',
    title: '',
    text: '',
    rating: 5
  });

  const fetchReviews = async () => {
    const deletedIds = JSON.parse(localStorage.getItem('deleted_review_ids') || '[]');
    const editedReviews = JSON.parse(localStorage.getItem('edited_reviews') || '{}');

    try {
      const response = await fetch('http://localhost:8081/api/reviews');
      const data = await response.json();
      if (Array.isArray(data)) {
        const active = data
          .filter(r => !deletedIds.includes(r.id))
          .map(r => editedReviews[r.id] ? { ...r, ...editedReviews[r.id] } : r);
        setReviews(active);
        return;
      }
    } catch (error) {
      console.error("Failed to fetch reviews from server:", error);
    }

    // Offline fallback only
    try {
      const local = JSON.parse(localStorage.getItem('custom_reviews') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        const activeLocal = local
          .filter(r => !deletedIds.includes(r.id))
          .map(r => editedReviews[r.id] ? { ...r, ...editedReviews[r.id] } : r);
        setReviews(activeLocal);
      }
    } catch (e) {}
  };

  const fetchStories = async () => {
    const deletedIds = JSON.parse(localStorage.getItem('deleted_story_ids') || '[]');
    const editedStories = JSON.parse(localStorage.getItem('edited_stories') || '{}');

    try {
      const response = await fetch('http://localhost:8081/api/stories');
      const data = await response.json();
      let combinedStories = [];

      if (Array.isArray(data) && data.length > 0) {
        const normalized = data
          .filter(s => !deletedIds.includes(s.id))
          .map(s => {
            const effective = editedStories[s.id] ? { ...s, ...editedStories[s.id] } : s;
            let imgs = [];
            if (Array.isArray(effective.images) && effective.images.length > 0) {
              imgs = effective.images;
            } else if (effective.img) {
              if (effective.img.includes('|||')) {
                imgs = effective.img.split('|||').filter(Boolean);
              } else if (effective.img.startsWith('[') && effective.img.endsWith(']')) {
                try {
                  const parsed = JSON.parse(effective.img);
                  if (Array.isArray(parsed) && parsed.length > 0) imgs = parsed;
                  else imgs = [effective.img];
                } catch (e) {
                  imgs = [effective.img];
                }
              } else {
                imgs = [effective.img];
              }
            }
            return {
              id: effective.id,
              name: effective.name,
              time: 'Recently added',
              images: imgs,
              img: imgs[0] || ''
            };
          });
        combinedStories = [...normalized.reverse()];
      }

      // Check localStorage for local custom stories
      try {
        const local = JSON.parse(localStorage.getItem('custom_stories') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          const localNormalized = local
            .filter(s => !deletedIds.includes(s.id))
            .map((s, idx) => {
              const effective = editedStories[s.id] || s;
              return {
                id: effective.id || ('local-' + idx),
                name: effective.name,
                time: 'Just now',
                images: effective.images || (effective.img ? [effective.img] : []),
                img: effective.img || (effective.images && effective.images[0]) || ''
              };
            });
          combinedStories = [...localNormalized, ...combinedStories];
        }
      } catch (e) {
        console.error(e);
      }

      // ONLY admin posted stories!
      setStories(combinedStories);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };


  useEffect(() => {
    fetchReviews();
    fetchStories();
  }, []);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentImages = currentStory 
    ? (Array.isArray(currentStory.images) && currentStory.images.length > 0 ? currentStory.images : [currentStory.img])
    : [];
  const currentImage = currentImages[activeImageIndex] || '';

  // Story Navigation Functions
  const goToNextImage = () => {
    if (activeStoryIndex === null) return;
    if (activeImageIndex < currentImages.length - 1) {
      setActiveImageIndex(prev => prev + 1);
      setProgress(0);
    } else if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
      setActiveImageIndex(0);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const goToPrevImage = () => {
    if (activeStoryIndex === null) return;
    if (activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
      setProgress(0);
    } else if (activeStoryIndex > 0) {
      const prevStory = stories[activeStoryIndex - 1];
      const prevImgs = Array.isArray(prevStory.images) && prevStory.images.length > 0 ? prevStory.images : [prevStory.img];
      setActiveStoryIndex(prev => prev - 1);
      setActiveImageIndex(prevImgs.length - 1);
      setProgress(0);
    }
  };

  const openStory = (index) => {
    setActiveStoryIndex(index);
    setActiveImageIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setActiveImageIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  // Auto-progress timer (5 seconds per image)
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const duration = 5000; // 5 seconds
    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / duration) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          goToNextImage();
          return 0;
        }
        return old + step;
      });
    }, intervalTime);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeStoryIndex, activeImageIndex, isPaused, currentImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'Escape') {
        closeStory();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex, activeImageIndex, currentImages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewReview({ author: '', title: '', text: '', rating: 5 });
        fetchReviews();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      try {
        const local = JSON.parse(localStorage.getItem('custom_reviews') || '[]');
        localStorage.setItem('custom_reviews', JSON.stringify([{ ...newReview, verified: false, id: 'local-' + Date.now() }, ...local]));
      } catch (err) {}
      setIsModalOpen(false);
      setNewReview({ author: '', title: '', text: '', rating: 5 });
      fetchReviews();
    }
  };



  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1) 
    : '5.0';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 bg-white">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-zinc-900 uppercase tracking-wide mb-6">
        What Our Customers Say
      </h1>
      
      {/* Rating Summary */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-6 border border-zinc-200 rounded-2xl p-4 sm:px-8 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-black text-zinc-900">{avgRating}</div>
            <div className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Out of 5</div>
          </div>
          <div className="h-10 w-px bg-zinc-200"></div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {reviews.length} verified reviews
            </div>
          </div>
        </div>
      </div>

      {/* Stories Carousel (Only rendered if admin has posted stories) */}
      {stories.length > 0 && (
        <div className="flex justify-center mb-10">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x max-w-full px-4">
            {stories.map((story, i) => {
              const storyImg = story.img || (story.images && story.images[0]) || '';
              const count = Array.isArray(story.images) ? story.images.length : 1;
              return (
                <div 
                  key={i} 
                  onClick={() => openStory(i)} 
                  className="flex flex-col items-center gap-2 shrink-0 snap-start cursor-pointer group"
                >
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 group-hover:scale-105 group-hover:shadow-md transition-all">
                    <div className="p-0.5 bg-white rounded-full">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-100 relative">
                        <img src={storyImg} alt={story.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    {count > 1 && (
                      <div className="absolute -bottom-1 right-1 bg-zinc-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-white/20">
                        <Layers className="w-2.5 h-2.5" />
                        {count}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-700 group-hover:text-zinc-950 transition-colors max-w-[80px] text-center truncate">
                    {story.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Write a Review Button */}
      <div className="flex justify-center mb-10">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-6 py-3 rounded-full font-bold transition-colors">
          <Star className="w-4 h-4 fill-white" />
          Write a Review
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
        <button className="bg-zinc-950 text-white px-5 py-2 rounded-full text-sm font-bold">All Reviews</button>
        <button className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-5 py-2 rounded-full text-sm font-semibold transition-colors">General Reviews</button>
        <button className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-5 py-2 rounded-full text-sm font-semibold transition-colors">Product Reviews</button>
        <div className="flex items-center gap-2 ml-0 sm:ml-4">
          <span className="text-sm font-medium text-zinc-500">Sort by</span>
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-50 transition-colors">
            Latest
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      {reviews.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="break-inside-avoid mb-6 bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
              {review.img && (
                <div className="w-full relative bg-zinc-50">
                  <img src={review.img} alt="Review" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`} />
                  ))}
                </div>
                {review.title && <h3 className="text-sm font-bold text-zinc-900 mb-2">{review.title}</h3>}
                {review.text && <p className="text-sm text-zinc-700 mb-4 leading-relaxed">{review.text}</p>}
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-bold text-zinc-900">{review.author}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Buyer
                    </span>
                  )}
                </div>
                {review.product && (
                  <div className="mt-3 text-[11px] font-semibold text-zinc-500 bg-zinc-50 inline-block px-3 py-1.5 rounded-lg">
                    {review.product}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-400 font-medium text-sm">
          No customer reviews posted yet.
        </div>
      )}


      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-900 mb-6">Write a Review</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={newReview.author}
                  onChange={e => setNewReview({...newReview, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Rating</label>
                <select 
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={newReview.rating}
                  onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={newReview.title}
                  onChange={e => setNewReview({...newReview, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">Review</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={newReview.text}
                  onChange={e => setNewReview({...newReview, text: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="mt-2 bg-zinc-950 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Instagram / WhatsApp Style Story Viewer Modal */}
      {currentStory && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) closeStory();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md select-none p-2 sm:p-4 animate-in fade-in duration-200"
        >
          {/* Main Story Container (Phone card format) */}
          <div 
            className="relative w-full max-w-[420px] h-[88vh] max-h-[760px] min-h-[520px] bg-[#0b141a] rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col justify-between"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Overlay: Progress Bars + Header */}
            <div className="absolute top-0 left-0 right-0 z-30 pt-3 pb-8 px-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Segmented Progress Bars (one segment per image in this section) */}
              <div className="flex items-center gap-1.5 mb-2.5">
                {currentImages.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-75"
                      style={{
                        width: idx < activeImageIndex 
                          ? '100%' 
                          : idx === activeImageIndex 
                            ? `${progress}%` 
                            : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full ring-2 ring-white/30 overflow-hidden shrink-0 shadow-md bg-zinc-800">
                    <img 
                      src={currentStory.img || currentImages[0]} 
                      alt={currentStory.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight truncate max-w-[170px]">
                      {currentStory.name}
                    </span>
                    <span className="text-white/70 text-[11px] font-medium flex items-center gap-1">
                      <span>{currentStory.time || 'Yesterday'}</span>
                      {currentImages.length > 1 && (
                        <span>• {activeImageIndex + 1}/{currentImages.length}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Header Actions: Pause/Play + White Circle Close Button */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused(prev => !prev);
                    }}
                    className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    title={isPaused ? "Play" : "Pause"}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      closeStory();
                    }}
                    className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-90 cursor-pointer ml-1"
                    title="Close story"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Media Area */}
            <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
              {/* Ambient Blurred Background for immersive feel */}
              {currentImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-125 pointer-events-none"
                  style={{ backgroundImage: `url(${currentImage})` }}
                />
              )}

              {/* Story Image */}
              {currentImage ? (
                <img 
                  key={currentImage}
                  src={currentImage} 
                  alt={`${currentStory.name} - slide ${activeImageIndex + 1}`} 
                  className="w-full h-full object-contain relative z-10 select-none pointer-events-none transition-opacity duration-150"
                />
              ) : (
                <div className="text-zinc-500 text-sm">No image available</div>
              )}

              {/* Tap Zones: Left 35% goes previous, Right 65% goes next */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute top-0 bottom-0 left-0 w-[35%] z-20 cursor-pointer" 
                title="Previous image"
              />
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute top-0 bottom-0 right-0 w-[65%] z-20 cursor-pointer" 
                title="Next image"
              />
            </div>

            {/* Left Circular Navigation Arrow Button (<) */}
            {(activeStoryIndex > 0 || activeImageIndex > 0) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] -ml-0.5" />
              </button>
            )}

            {/* Right Circular Navigation Arrow Button (>) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] -mr-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

