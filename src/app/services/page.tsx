import Link from "next/link";
import { 
  Sun, ArrowRight, Cpu, Activity, Settings, Cctv, Target, Droplets, Sprout, Leaf, Wifi, RadioTower, Lightbulb 
} from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Hero Section of Services Page */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">Services</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              Comprehensive technology and engineering solutions designed for efficiency, sustainability, and growth.
            </p>
          </div>
        </section>

        {/* Services Content Area */}
        <section className="pb-24 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
            
            {/* Core Service - Featured Block */}
            <div className="mb-16">
              <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative border border-primary/20">
                
                {/* Image Half */}
                <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-full">
                  <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80" alt="Solar Installation" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-primary" />
                  <div className="absolute top-6 left-6 z-10 lg:hidden">
                    <div className="inline-block px-4 py-1.5 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg">
                      Core Service
                    </div>
                  </div>
                </div>

                {/* Content Half */}
                <div className="lg:w-7/12 p-8 md:p-14 relative z-10 flex flex-col justify-center bg-primary">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="hidden lg:inline-block px-4 py-1.5 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full mb-8 w-fit shadow-lg">
                    Core Service
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-inner shrink-0">
                      <Sun className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold font-heading text-white leading-tight">Solar & Renewable Energy</h3>
                  </div>
                  
                  <p className="text-white/80 font-medium leading-relaxed text-lg mb-10">
                    Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial, commercial, and residential sectors.
                  </p>
                  
                  <div className="bg-black/10 rounded-3xl p-8 md:p-10 border border-white/5">
                    <h4 className="text-2xl font-bold text-white mb-8">Comprehensive Solar Capabilities:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                      {[
                        { name: "Solar Installation", desc: "End-to-end design and setup." },
                        { name: "Roof Top Solar", desc: "Optimizing commercial rooftops." },
                        { name: "Complete Solar Setup", desc: "Turnkey off-grid & on-grid." },
                        { name: "Net Metering", desc: "Grid synchronization & setup." },
                        { name: "Solar Lift Integration", desc: "Powering heavy industrial lifts." },
                        { name: "Maintenance & Support", desc: "24/7 technical assistance." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-4 group">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0 mt-1">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">{item.name}</h5>
                            <p className="text-white/70 text-sm font-medium">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Link href="/contact" className="inline-flex items-center px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/30">
                      Request Solar Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Services Section */}
            <div className="pt-8">
              <div className="text-center mb-12">
                <span className="text-primary font-bold uppercase tracking-wider text-sm">Other Services</span>
                <h2 className="text-4xl font-bold font-heading text-gray-900 mt-2">Technology & Infrastructure</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { 
                    icon: <Cpu className="w-8 h-8" />, 
                    title: "Computer & Accessories", 
                    desc: "Enterprise-grade IT hardware supply, network components, and comprehensive computer accessories for modern businesses.",
                    img: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80"
                  },
                  { 
                    icon: <Activity className="w-8 h-8" />, 
                    title: "Data Logger & IoT R&D", 
                    desc: "Custom research, development, and deployment of intelligent IoT devices and data logging systems for agriculture and industry.",
                    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                  },
                  { 
                    icon: <Settings className="w-8 h-8" />, 
                    title: "Server & Security Systems", 
                    desc: "Robust server infrastructure setup, maintenance, and advanced cybersecurity implementations to protect your data.",
                    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
                  },
                  { 
                    icon: <Cctv className="w-8 h-8" />, 
                    title: "CCTV Surveillance", 
                    desc: "High-definition, continuous monitoring IP camera systems for total premises security and remote viewing.",
                    img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80"
                  },
                  { 
                    icon: <Target className="w-8 h-8" />, 
                    title: "AI-Based Camera Models", 
                    desc: "Next-generation smart cameras equipped with artificial intelligence for automated threat detection and smart analytics.",
                    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
                  }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                      <img src={service.img} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                      <div className="absolute bottom-4 left-4 z-20 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {service.icon}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h4 className="text-2xl font-bold font-heading text-gray-900 mb-4 group-hover:text-primary transition-colors">{service.title}</h4>
                      <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-grow">{service.desc}</p>
                      <Link href="/contact" className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors mt-auto">
                        Consult with us <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
