"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const SolarInnovation = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Custom Autoplay logic
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const slides = [
    {
      title: "Solar Energy Automation",
      description: "High-tech robotic automation managing large-scale solar farms for maximum efficiency and precision.",
      image: "/images/slides/solar_automation_slide_1789677805531.jpg"
    },
    {
      title: "Hybrid Inverters",
      description: "State-of-the-art hybrid inverter systems combining grid and battery storage for uninterrupted power.",
      image: "/images/slides/hybrid_inverter_slide_1789677816112.jpg"
    },
    {
      title: "Central Solar Inverters",
      description: "Robust central inverters for commercial and industrial plants, engineered for heavy-duty power conversion.",
      image: "/images/slides/central_inverter_slide_1789677826849.jpg"
    },
    {
      title: "Net Metering Technology",
      description: "Advanced net metering integration allowing you to seamlessly sell surplus energy back to the national grid.",
      image: "/images/slides/net_metering_slide_1789677836790.jpg"
    },
    {
      title: "On-Grid Solar Systems",
      description: "Sleek, high-performance on-grid solar inverters perfectly synced with your local utility grid.",
      image: "/images/slides/on_grid_inverter_slide_1789677846524.jpg"
    },
    {
      title: "IoT & Smart Homes",
      description: "Control your entire energy ecosystem from a futuristic dashboard right at your fingertips.",
      image: "/images/slides/iot_smart_home_slide_1789677856585.jpg"
    },
    {
      title: "Agro-Photovoltaics",
      description: "Dual-use technology combining precision agriculture and solar energy production on the exact same land.",
      image: "/images/slides/agro_solar_slide_1789677870674.jpg"
    },
    {
      title: "Commercial Rooftop Solar",
      description: "Massive commercial rooftop installations powering industrial parks with clean, renewable energy.",
      image: "/images/slides/commercial_rooftop_slide_1789677880098.jpg"
    }
  ];

  return (
    <section className="pt-12 pb-24 bg-primary relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-[#1a2040]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px] animate-[spin_20s_linear_infinite] transform-origin-center pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6">
              Pioneering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-300">
                Solar Frontier
              </span>
            </h2>
            <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed">
              Explore our state-of-the-art videography and see how MaxIT Solution is reshaping the energy landscape with break-through technologies.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={scrollPrev}
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cinematic Slider */}
        <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/10" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative group h-[500px] md:h-[600px]">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90" />
                
                {/* Videography Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-md text-white shadow-[0_0_40px_rgba(232,87,70,0.4)] transform group-hover:scale-110 group-hover:bg-accent transition-all duration-500 cursor-pointer pointer-events-auto">
                    <Play fill="currentColor" className="w-8 h-8 ml-2" />
                  </div>
                </div>

                <div className="absolute text-left bottom-0 left-0 right-0 p-8 md:p-16">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolarInnovation;
