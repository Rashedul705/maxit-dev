import Link from "next/link";
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 pt-16 animate-slide-up overflow-hidden w-full">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-block px-4 py-2 bg-primary/5 rounded-full mb-6 border border-primary/10">
              <span className="text-primary font-semibold text-sm tracking-wider uppercase">Who We Are</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">MaxIT Solution</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              Your trusted partner in building a sustainable and intelligent future through cutting-edge technology.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-24 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img src="/images/slides/hybrid_inverter_slide_1789677816112.jpg" alt="MaxIT Solution Operations" className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-2xl font-bold font-heading mb-2">Innovating Since 2014</p>
                    <p className="text-white/80 font-medium">Delivering excellence across borders.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Empowering a Greener Tomorrow</h2>
                <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  MaxIT Solution is a leading provider of comprehensive solutions in sustainable energy, agricultural technology, and intelligent automation. We bridge the gap between complex technological capabilities and real-world industrial needs.
                </p>
                <div className="space-y-4 mb-10">
                  {['Sustainable Solar Energy', 'Smart Agro Technology', 'Industrial Automation'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-800 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA to Company Profile */}
                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-primary/5">
                  <h3 className="text-2xl font-bold text-primary mb-4">Want the full picture?</h3>
                  <p className="text-gray-600 mb-6">Explore our detailed company history, team, and complete portfolio of services and projects.</p>
                  <Link href="/company-profile" className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 group w-full justify-center">
                    View Company Profile
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
