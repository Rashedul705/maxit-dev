"use client";

import { useState, useEffect } from 'react';

export default function AboutHeroSlider({ slides }: { slides: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) {
    return (
      <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
        <img src="/images/slides/commercial_rooftop_slide_1789677880098.jpg" alt="Max iT Journey" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-3xl font-bold font-heading mb-2">Innovating Since 2014</p>
          <p className="text-lg opacity-90">Building the infrastructure of tomorrow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-3xl font-bold font-heading mb-2">{slide.title}</p>
            <p className="text-lg opacity-90">{slide.subtitle}</p>
          </div>
        </div>
      ))}
      
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
