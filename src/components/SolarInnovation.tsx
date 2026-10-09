"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const SolarInnovation = ({ content }: { content?: any }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  
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

  const defaultSlides = [
    {
      title: "Solar Energy Automation",
      description: "High-tech robotic automation managing large-scale solar farms for maximum efficiency and precision.",
      image: "/images/slides/solar_automation_slide_1789677805531.jpg",
      videoUrl: ""
    },
    {
      title: "Hybrid Inverters",
      description: "State-of-the-art hybrid inverter systems combining grid and battery storage for uninterrupted power.",
      image: "/images/slides/hybrid_inverter_slide_1789677816112.jpg",
      videoUrl: ""
    }
  ];

  const slides = content?.videos?.length > 0 ? content.videos : defaultSlides;

  return (
    <section className="pt-12 pb-24 bg-white relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-secondary/30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-[spin_20s_linear_infinite] transform-origin-center pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
              {content?.headingNormal || "Pioneering the"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {content?.headingHighlight || "Solar Frontier"}
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              {content?.subtext || "Explore our state-of-the-art videography and see how Max iT Solution is reshaping the energy landscape with break-through technologies."}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={scrollPrev}
              className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
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
                  src={slide.customThumbnail || slide.image || (slide.videoId ? `https://img.youtube.com/vi/${slide.videoId}/hqdefault.jpg` : '')} 
                  alt={slide.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
                
                {/* Videography Play Button or Link */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {(slide.youtubeLink || slide.videoUrl) && (
                    <div 
                      className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-md text-white shadow-[0_0_40px_rgba(4,107,210,0.4)] transform group-hover:scale-110 group-hover:bg-primary transition-all duration-500 cursor-pointer pointer-events-auto"
                      onClick={() => {
                        const link = slide.youtubeLink || slide.videoUrl;
                        if (link.includes('youtube.com/watch') || link.includes('youtu.be/')) {
                          const idMatch = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                          if (idMatch && idMatch[1]) {
                            setSelectedVideoUrl(`https://www.youtube.com/embed/${idMatch[1]}?autoplay=1`);
                            return;
                          }
                        }
                        // Fallback to open link in new tab if not a youtube video
                        if (link) {
                          window.open(link, '_blank');
                        }
                      }}
                    >
                      <Play fill="currentColor" className="w-8 h-8 ml-2" />
                    </div>
                  )}
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
      
      {/* Video Modal overlay */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedVideoUrl(null)}>
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl" onClick={e => e.stopPropagation()}>
            <iframe 
              src={selectedVideoUrl} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <button className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/80" onClick={() => setSelectedVideoUrl(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SolarInnovation;
