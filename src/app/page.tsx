import Hero from '../components/Hero';
import SolarInnovation from '../components/SolarInnovation';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { Settings, ArrowRight, Sun, Sprout, Zap, Leaf, Cpu, Headphones, TrendingDown, Wifi, Cctv, Droplets, RadioTower, Lightbulb } from 'lucide-react';
import Link from "next/link";

const Index = () => {
  const services = [
    {
      title: "Solar Home Systems (SHS)",
      description: "Complete solar energy solutions for residential use, reducing grid dependency and promoting green energy throughout the community.",
      icon: <Sun className="w-8 h-8" />,
      features: ["Rooftop Installation", "Battery Storage", "Grid Independence"],
      image: "/images/slides/hybrid_inverter_slide_1789677816112.jpg"
    },
    {
      title: "Solar Pump & Smart Irrigation",
      description: "Advanced solar-powered pumping systems integrated with smart irrigation technology for efficient water management in agriculture.",
      icon: <Sprout className="w-8 h-8" />,
      features: ["Automated Watering", "Solar Powered", "High Efficiency"],
      image: "/images/slides/agro_solar_slide_1789677870674.jpg"
    },
    {
      title: "Agro Technology",
      description: "Innovative agricultural tech solutions including IoT monitoring, soil sensors, and automated climate control for greenhouses.",
      icon: <Leaf className="w-8 h-8" />,
      features: ["IoT Monitoring", "Soil Sensors", "Climate Control"],
      image: "/images/slides/agro_tech_service_1789678968707.jpg"
    },
    {
      title: "Industrial & Home Automation",
      description: "Smart control systems for industries and homes, improving efficiency, safety, and convenience through electric automation.",
      icon: <Cpu className="w-8 h-8" />,
      features: ["Smart Controls", "IoT Integration", "Energy Tracking"],
      image: "/images/slides/iot_smart_home_slide_1789677856585.jpg"
    },
    {
      title: "Networking & Internet Services",
      description: "Robust network infrastructure design and reliable high-speed internet connectivity for businesses and rural areas.",
      icon: <Wifi className="w-8 h-8" />,
      features: ["High-speed Setup", "Network Security", "Infrastructure Design"],
      image: "/images/slides/networking_service_1789678979212.jpg"
    },
    {
      title: "CCTV Security Systems",
      description: "Professional installation of IP camera systems and surveillance solutions for 24/7 security monitoring.",
      icon: <Cctv className="w-8 h-8" />,
      features: ["24/7 Monitoring", "IP Cameras", "Cloud Storage"],
      image: "/images/slides/cctv_service_1789678989455.jpg"
    },
    {
      title: "Water Treatment Solutions",
      description: "Comprehensive water treatment plants ensuring clean and safe water for communities and industries.",
      icon: <Droplets className="w-8 h-8" />,
      features: ["Purification Plants", "Filtration", "Quality Monitoring"],
      image: "/images/slides/water_treatment_service_1789679001434.jpg"
    },
    {
      title: "Communication Infrastructure",
      description: "Construction and maintenance of radio communication towers and related infrastructure.",
      icon: <RadioTower className="w-8 h-8" />,
      features: ["Radio Towers", "Maintenance", "Signal Optimization"],
      image: "/images/slides/solar_automation_slide_1789677805531.jpg"
    },
    {
      title: "Building Electrical Engineering",
      description: "Expert electrical planning and wiring services for commercial and residential construction projects.",
      icon: <Lightbulb className="w-8 h-8" />,
      features: ["Wiring Planning", "Safety Compliance", "Commercial Projects"],
      image: "/images/slides/commercial_rooftop_slide_1789677880098.jpg"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      company: "Green Farms Ltd",
      testimonial: "MaxIT Solution's solar irrigation system transformed our farming efficiency. Highly professional and reliable implementation.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Mohammad Rahman",
      company: "Industrial Complex",
      testimonial: "Their automation solutions have significantly reduced our operational costs. Excellent technical expertise.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Fatima Khan",
      company: "Eco Home Owner",
      testimonial: "The solar home system installation was smooth and the team was very knowledgeable. Great service!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const reasons = [
    {
      title: "Sustainable Energy",
      description: "Harnessing the power of the sun for a greener, cost-effective, and highly efficient future.",
      icon: <Sun className="w-8 h-8" />,
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "Technical Expertise",
      description: "Reliable technical solutions backed by years of robust experience in automation and precise engineering.",
      icon: <Settings className="w-8 h-8" />,
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      title: "Agro Innovation",
      description: "Modernizing agriculture with smart irrigation and cutting-edge technology-driven solutions.",
      icon: <Leaf className="w-8 h-8" />,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Smart Automation",
      description: "Seamlessly connect and control industrial and home environments with intelligent IoT systems.",
      icon: <Cpu className="w-8 h-8" />,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      title: "24/7 Premium Support",
      description: "Our dedicated support team ensures your systems run flawlessly around the clock without interruption.",
      icon: <Headphones className="w-8 h-8" />,
      gradient: "from-rose-400 to-red-500",
    },
    {
      title: "Cost Efficiency",
      description: "Optimized energy and automation systems designed to significantly lower your operational expenses.",
      icon: <TrendingDown className="w-8 h-8" />,
      gradient: "from-teal-400 to-cyan-500",
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
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-16">
            {reasons.map((reason, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${reason.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out`} />
                
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center text-white mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {reason.icon}
                </div>
                
                <h3 className="relative z-10 text-2xl font-bold font-heading text-primary mb-3">{reason.title}</h3>
                <p className="relative z-10 text-gray-700 leading-relaxed font-medium">{reason.description}</p>
              </div>
            ))}
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
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              From solar energy systems to smart industrial automation, we offer the robust technologies you need to power your future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.slice(0, 3).map((service, index) => (
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
      <section className="py-32 bg-[#0F172A] relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
              Client Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Stories</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
              Don't just take our word for it — hear from the visionaries who have experienced the MaxIT difference firsthand.
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
      <section className="py-32 relative overflow-hidden flex items-center justify-center min-h-[600px] bg-[#0F172A]">
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/slides/commercial_rooftop_slide_1789677880098.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
        </div>

        {/* Dynamic Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/40 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/60 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite]" />
        
        {/* Glassmorphism Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl text-center transform transition-all duration-700 hover:border-white/20 hover:bg-white/10">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 tracking-tight">
              Ready to Power Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Future?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Let's work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-accent to-orange-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transform hover:-translate-y-1 hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 text-lg">Get Started Today</span>
                <ArrowRight className="relative z-10 ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/20 bg-transparent text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1 w-full sm:w-auto text-lg"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main></div>
  );
};

export default Index;
