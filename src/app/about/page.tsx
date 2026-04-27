import { ArrowRight, Target, Eye, Shield, Users } from 'lucide-react';
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 pt-16 animate-slide-up overflow-hidden w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">MaxIT Solution</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
            16 years of pushing the boundaries in advanced engineering, sustainable energy, and automated technical support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">
                Pioneering Engineering Solutions
              </h2>
              <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                Max IT Solution LTD. is an advanced technology solution provider specializing in sustainable energy and industrial automation. We provide comprehensive engineering support guaranteed to bring robust, measurable scalability to modern infrastructure.
              </p>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                Combining technical expertise with innovative technology, we aim to produce high-quality, cost-effective, reliable, and result-oriented solutions. Max IT prides itself on exceptional after-sales support. If you face any problems after completing our work, our rapidly deployable team is always ready to respond to ensure your satisfaction.
              </p>
              
              <div className="pt-8">
                <Link
                  href="/services"
                  className="inline-flex items-center text-accent font-semibold hover:text-primary transition-colors group"
                >
                  Discover Our Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <Target className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold font-heading text-primary mb-2">Our Mission</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  To provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses globally.
                </p>
              </div>
              <div className="bg-accent/5 p-8 rounded-3xl border border-accent/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:mt-12">
                <Eye className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold font-heading text-primary mb-2">Our Vision</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Leading the transition towards intelligent infrastructures and sustainable renewable integrations in every sector.
                </p>
              </div>
              <div className="bg-accent/5 p-8 rounded-3xl border border-accent/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold font-heading text-primary mb-2">Reliability</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  Unmatched after-sales support guaranteeing operational uptime and comprehensive technical assurances.
                </p>
              </div>
              <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:mt-12">
                <Users className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-bold font-heading text-primary mb-2">Expert Team</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  A deeply seasoned team of engineers ensuring the utmost return on investment in the shortest possible time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
            Partner With Max IT Today
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 font-light leading-relaxed">
            Experience the difference with Max IT Solution LTD. Contact us today to learn how we can harness the power of technology to drive your business forward.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 transform hover:-translate-y-1"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </main></div>
  );
};

export default About;
