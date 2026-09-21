import { 
  ArrowRight, Target, Eye, Shield, Users, MapPin, 
  Phone, Mail, Globe, Award, CheckCircle2, Star, 
  Zap, Building, TrendingUp, Cpu, Leaf, Wrench,
  Facebook, Twitter, Linkedin, ChevronRight, Activity
} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 pt-16 animate-slide-up overflow-hidden w-full">
        
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-block px-4 py-2 bg-primary/5 rounded-full mb-6 border border-primary/10">
              <span className="text-primary font-semibold text-sm tracking-wider uppercase">Company Profile</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">MaxIT Solution</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
              Empowering the future through advanced engineering, sustainable energy, and innovative automation solutions.
            </p>
          </div>
        </section>

        {/* 2. Company Overview */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">
                  Who We Are
                </h2>
                <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
                <p className="text-gray-600 leading-relaxed font-light text-lg">
                  Max IT Solution LTD. is an advanced technology solution provider specializing in sustainable energy and industrial automation. We provide comprehensive engineering support guaranteed to bring robust, measurable scalability to modern infrastructure.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-primary mb-1 flex items-center"><Building className="w-4 h-4 mr-2 text-accent"/> Established</h4>
                    <p className="text-gray-500 font-light">2014</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2 text-accent"/> Headquarters</h4>
                    <p className="text-gray-500 font-light">Rajshahi-6000</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-bold text-primary mb-1 flex items-center"><Award className="w-4 h-4 mr-2 text-accent"/> Tagline</h4>
                    <p className="text-gray-500 font-light italic">"Innovating Infrastructure for a Sustainable Tomorrow"</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Company Office" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Mission, Vision & Core Values */}
        <section className="py-24 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Our Purpose & Values</h2>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Target className="w-12 h-12 text-accent mb-6 bg-accent/10 p-2 rounded-2xl" />
                <h3 className="text-2xl font-bold font-heading text-primary mb-4">Our Mission</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  To provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses globally, ensuring maximum ROI through cutting-edge engineering and unparalleled technical support.
                </p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Eye className="w-12 h-12 text-primary mb-6 bg-primary/10 p-2 rounded-2xl" />
                <h3 className="text-2xl font-bold font-heading text-primary mb-4">Our Vision</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Leading the transition towards intelligent infrastructures and sustainable renewable integrations in every sector, setting the global standard for industrial automation and clean energy adoption.
                </p>
              </div>
            </div>

            <div className="bg-primary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-2xl font-bold font-heading mb-8 text-center">Core Values</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { icon: Shield, title: "Integrity", desc: "Honesty and transparency in all our dealings." },
                  { icon: Zap, title: "Innovation", desc: "Continuously pushing technological boundaries." },
                  { icon: Users, title: "Collaboration", desc: "Working together to achieve mutual success." },
                  { icon: CheckCircle2, title: "Excellence", desc: "Delivering superior quality in every project." }
                ].map((value, idx) => (
                  <div key={idx} className="text-center">
                    <value.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                    <h4 className="text-lg font-bold mb-2">{value.title}</h4>
                    <p className="text-primary-foreground/70 text-sm font-light">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Products & Services */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Core Offerings</h2>
              <p className="text-gray-500 font-light text-lg mb-6">Comprehensive solutions tailored for modern industrial needs.</p>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Leaf, title: "Solar Energy Solutions", desc: "Commercial and residential solar installations, battery storage, and energy management systems." },
                { icon: Cpu, title: "Industrial Automation", desc: "PLC programming, SCADA systems, and robotic integrations for streamlined manufacturing." },
                { icon: Wrench, title: "Advanced Engineering Support", desc: "24/7 technical maintenance, system upgrades, and infrastructure consulting." }
              ].map((service, idx) => (
                <div key={idx} className="group bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-accent/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-accent transition-all duration-300 mb-6">
                    <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-primary mb-3">{service.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Why Choose Us (USP) */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Why Partner With Us?</h2>
                  <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
                  <p className="text-primary-foreground/80 font-light text-lg mb-8 leading-relaxed">
                    We don't just deliver projects; we build long-term partnerships. Our unique approach ensures your infrastructure is always optimized for peak performance.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Decades of combined engineering expertise",
                      "Guaranteed 24/7 post-installation support",
                      "Cost-effective, scalable solutions",
                      "Commitment to sustainable and green technologies"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center text-lg font-light">
                        <CheckCircle2 className="w-6 h-6 text-accent mr-4 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: "10+", label: "Years Experience" },
                    { number: "500+", label: "Projects Completed" },
                    { number: "24/7", label: "Technical Support" },
                    { number: "99%", label: "Client Satisfaction" }
                  ].map((stat, idx) => (
                     <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10 text-center hover:bg-white/20 transition-colors duration-300">
                        <h4 className="text-4xl font-bold text-accent mb-2">{stat.number}</h4>
                        <p className="text-sm font-light uppercase tracking-wider">{stat.label}</p>
                     </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* 6. Leadership Team */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Leadership Team</h2>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "John Doe", role: "Chief Executive Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { name: "Jane Smith", role: "Head of Engineering", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                { name: "Robert Johnson", role: "Director of Operations", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
              ].map((member, idx) => (
                <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="h-64 overflow-hidden relative">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="flex space-x-3 text-white">
                        <Linkedin className="w-5 h-5 hover:text-accent cursor-pointer" />
                        <Twitter className="w-5 h-5 hover:text-accent cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold font-heading text-primary">{member.name}</h3>
                    <p className="text-accent font-medium text-sm mt-1">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Milestones & Achievements */}
        <section className="py-24 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Our Journey</h2>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {[
                { year: "2014", title: "Company Founded", desc: "Started as a small consulting firm in Dhaka." },
                { year: "2017", title: "First Major Solar Project", desc: "Successfully installed a 5MW solar grid for a commercial client." },
                { year: "2020", title: "ISO Certification", desc: "Awarded ISO 9001 for quality management systems." },
                { year: "2023", title: "National Expansion", desc: "Opened three new branch offices across the country." }
              ].map((milestone, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-primary text-lg">{milestone.title}</h3>
                      <span className="font-bold text-accent px-3 py-1 bg-accent/10 rounded-full text-sm">{milestone.year}</span>
                    </div>
                    <p className="text-gray-500 font-light text-sm leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Portfolio & Social Proof */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Trusted By Industry Leaders</h2>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            {/* Dummy Client Logos */}
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-20">
              <Building className="w-16 h-16 text-primary" />
              <Activity className="w-16 h-16 text-primary" />
              <Globe className="w-16 h-16 text-primary" />
              <Cpu className="w-16 h-16 text-primary" />
              <Zap className="w-16 h-16 text-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { quote: "MaxIT completely overhauled our automation infrastructure. Their attention to detail and post-sales support is unmatched.", author: "Sarah Jenkins", company: "TechCorp Industries" },
                { quote: "The solar integration they provided cut our energy costs by 40%. A highly professional and dedicated team.", author: "Michael Chen", company: "GreenFuture Logistics" }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                  <Star className="absolute top-8 right-8 w-8 h-8 text-accent/20" />
                  <div className="flex space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent fill-accent" />)}
                  </div>
                  <p className="text-gray-600 font-light italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="font-bold text-primary">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Contact Information & CTA */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 lg:p-16 relative">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">Get In Touch</h2>
                  <p className="text-primary-foreground/80 mb-10 font-light leading-relaxed">
                    Ready to transform your infrastructure? Contact us today to discuss your next project.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center text-white">
                      <MapPin className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-light">2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Phone className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-light">+88 01724-958474</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Mail className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-light">sales@m4xit.com</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white"><Facebook className="w-5 h-5"/></a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white"><Twitter className="w-5 h-5"/></a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white"><Linkedin className="w-5 h-5"/></a>
                  </div>
                </div>
                <div className="bg-gray-100 p-12 lg:p-16 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold font-heading text-primary mb-6">Start Your Project</h3>
                  <p className="text-gray-600 mb-8 font-light">Fill out our contact form and our team will get back to you within 24 hours.</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 group"
                  >
                    Contact Us Now
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
