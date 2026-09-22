import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Award, Target, Eye, 
  Settings, Users, Leaf, ThumbsUp, Wrench, CheckCircle2 
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        
        {/* 1. Hero & Brand Story / Our Journey */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary/5 rounded-full mb-6 border border-primary/10">
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Journey</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
                The Story Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">MaxIT</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
                Founded with a passion for innovation, MaxIT Solution began with a simple goal: to make industrial-grade engineering and sustainable energy accessible. Over the years, we have grown from a small technical startup into a trusted regional leader, driven by a commitment to reliability and engineering excellence.
              </p>
            </div>
            
            <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px] md:h-[500px]">
              <img src="/images/slides/commercial_rooftop_slide_1789677880098.jpg" alt="MaxIT Journey" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-3xl font-bold font-heading mb-2">Innovating Since 2014</p>
                <p className="text-lg opacity-90">Building the infrastructure of tomorrow.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Mission & Vision */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold font-heading text-primary mb-4">Our Mission</h3>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  To empower businesses, industries, and communities by delivering robust, scalable, and sustainable technology solutions. We strive to solve complex engineering challenges with innovation, ensuring efficiency and long-term value for every client we serve.
                </p>
              </div>

              <div className="bg-primary p-10 rounded-3xl shadow-xl text-white hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:bg-white/10 transition-colors"></div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold font-heading mb-4">Our Vision</h3>
                <p className="text-white/90 text-lg leading-relaxed font-medium">
                  To be the region's most trusted engineering and technology partner, driving the transition towards smart automation, renewable energy, and intelligent infrastructure on a global scale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Value Proposition / What Sets Us Apart */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">What Sets Us Apart</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
                Why forward-thinking companies choose MaxIT as their trusted technology partner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: "Premium Equipment", desc: "We source and deploy only industry-leading, rigorously tested materials." },
                { icon: Users, title: "Expert Engineers", desc: "Our team consists of certified professionals with years of hands-on experience." },
                { icon: Zap, title: "End-to-End Solutions", desc: "From conceptual design to final commissioning and maintenance." },
                { icon: Wrench, title: "24/7 Support", desc: "Dedicated after-sales support ensuring maximum uptime and reliability." }
              ].map((feature, idx) => (
                <div key={idx} className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
                  <feature.icon className="w-12 h-12 text-accent mb-6" />
                  <h4 className="text-xl font-bold text-primary mb-3">{feature.title}</h4>
                  <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="py-24 bg-[#0B1120] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3">
                <h2 className="text-4xl font-bold font-heading mb-6">Our Core Values</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  These guiding principles shape our culture, drive our decisions, and define how we interact with our clients and the world.
                </p>
                <div className="w-20 h-1 bg-accent rounded-full"></div>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: Award, title: "Quality Assurance", desc: "Never compromising on standards. Excellence is our baseline." },
                  { icon: CheckCircle2, title: "Integrity & Transparency", desc: "Honest communication and ethical business practices in every deal." },
                  { icon: ThumbsUp, title: "Customer Success", desc: "Your success is our success. We build long-term partnerships." },
                  { icon: Leaf, title: "Sustainable Innovation", desc: "Prioritizing eco-friendly solutions that protect our future." }
                ].map((val, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <val.icon className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{val.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Visuals & Behind-the-Scenes */}
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">Behind The Scenes</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
                A glimpse into our operational excellence and the technology that drives us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group h-[400px] md:h-auto">
                <img src="/images/slides/agro_solar_slide_1789677870674.jpg" alt="Agro Solar Project" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group h-[250px]">
                <img src="/images/slides/iot_smart_home_slide_1789677856585.jpg" alt="Smart Home Tech" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group h-[250px]">
                <img src="/images/slides/networking_service_1789678979212.jpg" alt="Networking Infrastructure" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call to Action (CTA) */}
        <section className="relative py-24 bg-primary overflow-hidden text-center text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent rounded-full blur-[100px] pointer-events-none transform translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">Ready to Transform Your Future?</h2>
            <p className="text-xl text-white/80 font-medium mb-12 max-w-2xl mx-auto">
              Whether you need scalable solar energy, industrial automation, or enterprise networking, our team is ready to build your solution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/services" 
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-[#d4483a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 text-lg"
              >
                Explore Our Solutions
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white hover:text-primary transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 text-lg backdrop-blur-sm"
              >
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default About;
