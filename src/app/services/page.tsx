import { Sun, Sprout, Leaf, Cpu, Wifi, Cctv, Droplets, RadioTower, Lightbulb } from 'lucide-react';

import ServiceCard from '@/components/ServiceCard';

const Services = () => {
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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 pt-16 animate-slide-up overflow-hidden w-full">
      {/* Hero Section of Services Page */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              Our Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">Services</span>
            </h1>
            <p className="text-xl text-gray-700 font-medium leading-relaxed">
              Specialized solutions for sustainable energy, modern agriculture, robust infrastructure, and smart industrial automation tailored to your unique needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
            Need a Customized Solution?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 font-medium leading-relaxed">
            Our experts are ready to design and implement robust systems suited exactly for your business or community requirements.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 transform hover:-translate-y-1"
          >
            Contact Our Experts
          </a>
        </div>
      </section>
    </main></div>
  );
};

export default Services;
