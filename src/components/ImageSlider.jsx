import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const isDarkMode = useDarkMode();

  // Array of slider images
  const sliderImages = Array.from({ length: 14 }, (_, i) => `slider-${String(i + 1).padStart(2, '0')}.jpg`);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, sliderImages.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 8 seconds of manual interaction
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <section 
      className={`relative w-full max-w-6xl mx-auto my-12 px-4 ${isDarkMode ? 'dark' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
        {/* Main slider container */}
        <div className="relative h-64 md:h-80 lg:h-96">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={`/${image}`}
                  alt={`Fashion showcase ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === currentSlide ? 'eager' : 'lazy'}
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>


          {/* Slide counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentSlide + 1} / {sliderImages.length}
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span className="text-white text-sm font-medium">
              {isAutoPlaying ? 'Auto' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Slider info */}
        <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Discover Our Fashion Collection
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Explore our curated selection of stylish second-hand clothing and accessories. 
            Each piece tells a story and contributes to sustainable fashion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
