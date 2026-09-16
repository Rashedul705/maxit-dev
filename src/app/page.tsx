import Hero from '../components/Hero';
import SolarInnovation from '../components/SolarInnovation';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { Settings, ArrowRight, Sun, Sprout, Zap, Leaf } from 'lucide-react';
import Link from "next/link";

const Index = () => {
  const services = [
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Solar Energy",
      description: "Sustainable power solutions including Solar Home Systems (SHS) and rooftop installations.",
      features: ["Solar Home Systems", "Rooftop Solar", "Energy Efficiency", "Green Power"]
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Smart Irrigation & Agro Tech",
      description: "Advanced agricultural technology and solar-powered irrigation for modern farming.",
      features: ["Solar Pumps", "Smart Irrigation", "Agro Technology", "Water Management"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Electric Automation",
      description: "Industrial and home automation solutions for efficiency and control.",
      features: ["Industrial Automation", "Smart Home Control", "Electric Systems", "IoT Solutions"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      company: "Green Farms Ltd",
      testimonial: "MaxIT Solution's solar irrigation system transformed our farming efficiency. Highly professional and reliable implementation.",
      rating: 5
    },
    {
      name: "Mohammad Rahman",
      company: "Industrial Complex",
      testimonial: "Their automation solutions have significantly reduced our operational costs. Excellent technical expertise.",
      rating: 5
    },
    {
      name: "Fatima Khan",
      company: "Eco Home Owner",
      testimonial: "The solar home system installation was smooth and the team was very knowledgeable. Great service!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 animate-slide-up overflow-hidden w-full">
      <Hero />
      <SolarInnovation />

      {/* About Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              Why Choose MaxIT Solution?
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-accent/10">
                <Sun className="w-12 h-12 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-primary mb-4">Sustainable Energy</h3>
              <p className="text-gray-500 px-4 leading-relaxed">Harnessing the power of the sun for a greener, cost-effective, and highly efficient future.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-primary/10 mt-0 lg:mt-8">
                <Settings className="w-12 h-12 text-primary group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-primary mb-4">Technical Expertise</h3>
              <p className="text-gray-500 px-4 leading-relaxed">Reliable technical solutions backed by years of robust experience in automation and precise engineering.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-accent/10">
                <Leaf className="w-12 h-12 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-primary mb-4">Agro Innovation</h3>
              <p className="text-gray-500 px-4 leading-relaxed">Modernizing agriculture with smart irrigation and cutting-edge technology-driven solutions.</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              Learn More About Us
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              Our Premium Services
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
              From solar energy systems to smart industrial automation, we offer the robust technologies you need to power your future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-4 border-2 border-accent text-accent font-semibold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 shadow-sm group transform hover:-translate-y-1"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
              Don't just take our word for it - hear from the clients who have experienced the MaxIT difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-8">
            Ready to Power Your Future?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Let's work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 transform hover:-translate-y-1"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </main></div>
  );
};

export default Index;
