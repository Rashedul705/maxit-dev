'use client';

import { ArrowRight, Sun, Zap, Sprout } from 'lucide-react';
import Link from "next/link";
import CountUp from "@/components/ui/CountUp";
import { useState, useEffect } from 'react';

const defaultImages = [
  '/images/hero-bg.jpg',
  '/images/slides/solar_automation_slide_1789677805531.jpg',
  '/images/slides/commercial_rooftop_slide_1789677880098.jpg',
  '/images/slides/agro_solar_slide_1789677870674.jpg',
];

interface HeroProps {
  content?: {
    brandingText?: string;
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    backgroundImages?: string[];
    stats?: { number?: string; label?: string }[];
  },
  siteSettings?: any;
}

const Hero = ({ content, siteSettings }: HeroProps) => {
  const defaultStats = [
    { number: '50+', label: 'Projects' },
    { number: '30+', label: 'Clients' },
    { number: '10+', label: 'Years Exp' },
    { number: '24/7', label: 'Support' }
  ];

  const rawStats = content?.stats && content.stats.length > 0 ? content.stats : defaultStats;
  
  const stats = rawStats.map(stat => {
    const numStr = stat.number || '';
    const numMatch = numStr.match(/\d+/);
    const end = numMatch ? parseInt(numMatch[0]) : 0;
    const suffix = numStr.replace(/\d+/g, '');
    return { end, suffix, label: stat.label };
  });

  const brandingText = content?.brandingText || "Max iT";
  const titleLine1 = content?.titleLine1 || "Solar Energy &";
  const titleLine2 = content?.titleLine2 || "Smart Automation";
  const description = content?.subtitle || "Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.";
  
  const backgroundImages = content?.backgroundImages && content.backgroundImages.length > 0
    ? content.backgroundImages
    : defaultImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">


          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight font-heading tracking-tight drop-shadow-xl">
            {titleLine1} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-md">
              {titleLine2}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 px-4">
            <Link
              href={siteSettings?.heroPrimaryButtonLink || "/services"}
              className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={siteSettings?.heroSecondaryButtonLink || "/contact"}
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-primary font-semibold rounded-2xl hover:border-primary hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Us
            </Link>
          </div>

          {/* Stats Section with Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-primary mb-2 font-heading">
                  <CountUp end={stat.end} /><span className="text-accent">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-700 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
