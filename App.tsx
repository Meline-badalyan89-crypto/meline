import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES, getIcon } from './constants';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[currentSlideIndex];

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1 < totalSlides ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4 sm:p-8 text-slate-800 select-none">
      
      {/* Main Container */}
      <div className="w-full max-w-5xl aspect-video bg-white rounded-2xl shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500">
                {currentSlideIndex + 1} / {totalSlides}
            </div>
            <button 
                onClick={toggleFullscreen}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                title="Fullscreen"
            >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fadeIn relative">
            
            {/* Background Decorations for visual appeal */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full -z-10 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-50 rounded-tl-full -z-10 opacity-50"></div>

            {/* Icon */}
            <div className="transform transition-all duration-500 hover:scale-110">
                {getIcon(currentSlide.icon)}
            </div>

            {/* Title */}
            <h1 className={`font-bold text-slate-800 mb-4 leading-tight ${
                currentSlide.type === 'cover' ? 'text-4xl md:text-5xl lg:text-6xl text-blue-700' : 'text-3xl md:text-4xl'
            }`}>
                {currentSlide.title}
            </h1>

            {/* Subtitle */}
            {currentSlide.subtitle && (
                <h2 className={`font-medium text-slate-600 mb-8 ${
                    currentSlide.type === 'cover' ? 'text-xl md:text-2xl italic' : 'text-lg md:text-xl'
                }`}>
                    {currentSlide.subtitle}
                </h2>
            )}

            {/* Points / Content */}
            <div className={`w-full max-w-3xl ${currentSlide.type === 'cover' ? 'mt-8' : 'mt-4 text-left'}`}>
                {currentSlide.type === 'cover' ? (
                    <div className="flex flex-col gap-2 text-lg text-slate-600 font-medium">
                        {currentSlide.points.map((point, idx) => (
                            <p key={idx}>{point}</p>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {currentSlide.points.map((point, idx) => (
                            <li key={idx} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-sm transition hover:shadow-md hover:bg-blue-50">
                                <span className="mr-3 text-blue-500 font-bold text-xl">•</span>
                                <span className="text-lg md:text-xl text-slate-700 leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        {/* Navigation Controls */}
        <div className="h-20 border-t border-gray-100 bg-gray-50 flex items-center justify-between px-8">
            <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentSlideIndex === 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-slate-600 hover:bg-white hover:shadow-md active:scale-95'
                }`}
            >
                <ChevronLeft size={20} />
                <span>Նախորդ</span>
            </button>

            <div className="hidden sm:flex space-x-1">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            idx === currentSlideIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>

            <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentSlideIndex === totalSlides - 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
                }`}
            >
                <span>Հաջորդ</span>
                <ChevronRight size={20} />
            </button>
        </div>

      </div>

      {/* Keyboard Hint */}
      <div className="fixed bottom-4 text-xs text-gray-500 opacity-60 hidden md:block">
        Օգտագործեք սլաքները (← →) տեղաշարժվելու համար
      </div>

    </div>
  );
};

export default App;