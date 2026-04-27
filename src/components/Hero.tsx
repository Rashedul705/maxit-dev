import { ArrowRight, Sun, Zap, Sprout } from 'lucide-react';
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-white pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Floating Icons */}
          <div className="flex justify-center space-x-6 mb-10">
            <div className="p-4 bg-white/80 backdrop-blur-sm shadow-xl shadow-accent/10 rounded-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <Sun className="w-8 h-8 text-accent" />
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm shadow-xl shadow-accent/10 rounded-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 mt-4">
              <Sprout className="w-8 h-8 text-accent" />
            </div>
            <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-primary/20 transform hover:-translate-y-2 transition-all duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-8 leading-tight font-heading tracking-tight">
            Solar Energy & <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">
              Smart Automation
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 px-4">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-semibold rounded-2xl hover:bg-accent/90 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-primary font-semibold rounded-2xl hover:border-primary hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Us
            </Link>
          </div>

          {/* Stats Section with Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
            <div className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2 font-heading">50<span className="text-accent">+</span></div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Projects</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2 font-heading">30<span className="text-accent">+</span></div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Clients</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2 font-heading">5<span className="text-accent">+</span></div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Years Exp</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2 font-heading">24<span className="text-accent">/7</span></div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
