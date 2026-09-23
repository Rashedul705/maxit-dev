import Link from 'next/link';
import { 
  ArrowRight, ChevronRight, MapPin, Phone, Mail, MessageCircle, Linkedin,
  Sun, Droplets, Sprout, Cpu, Wifi, Cctv, RadioTower, Lightbulb, 
  Target, Shield, Settings, Home, Factory, Building2,
  GraduationCap, Activity, Landmark, Briefcase, FileCheck, Download
} from 'lucide-react';
import { projects } from '@/lib/projects';

import sobujImg from "@/assets/team/ceo-maxit.png";
import shohidImg from "@/assets/team/shohid.jpg";
import shahidafridiImg from "@/assets/team/shahidafridi.jpeg";
import rupaliImg from "@/assets/team/rupali.jpg";
import touhidurImg from "@/assets/team/touhidur.jpg";
import priyankaImg from "@/assets/team/priyanka.jpg";
import emonImg from "@/assets/team/emon-ali.jpg";
import moznuImg from "@/assets/team/moznu.jpg";
import rashedulImg from "@/assets/team/rashedul.jpg";

// Real Team Data brought from team page
const team = [
  { name: "Engr. Zahangir Alam (Sobuj)", role: "Chief Executive Officer", description: "Driven by a vision of innovation, technological excellence, and sustainable development.", image: sobujImg, email: "sales@m4xit.com", linkedin: "#" },
  { name: "Rupali", role: "Project Director", description: "Experienced project director ensuring successful execution and delivery of our initiatives.", image: rupaliImg, email: "rupali@m4xit.com", linkedin: "#" },
  { name: "Sarwar Jahan", role: "Software Engineer", description: "Expert software engineer developing robust and scalable digital solutions.", image: shohidImg, email: "shohid@m4xit.com", linkedin: "#" },
  { name: "Rashedul Islam", role: "Software Engineer", description: "BSc in Computer Science and Engineering. Dedicated to building scalable software.", image: rashedulImg, email: "rashedul.afl@gmail.com", linkedin: "https://www.linkedin.com/in/rislam05/" },
  { name: "Tauhidur Rahman Rony", role: "Adviser", description: "Strategic adviser providing expert guidance on business development and operations.", image: touhidurImg, email: "rony@m4xit.com", linkedin: "#" },
  { name: "Priyanka Roy", role: "Senior Executive", description: "Dedicated senior executive managing key administrative and operational functions.", image: priyankaImg, email: "sales@m4xit.com", linkedin: "#" },
  { name: "Md. Emon Ali", role: "Assistant Engineer", description: "Skilled assistant engineer supporting our technical projects and implementations.", image: emonImg, email: "emon@m4xit.com", linkedin: "#" },
  { name: "MD .SHAHID AFRIDI", role: "Maintaince Engineer", description: "Skilled Maintaince Engineer supporting our technical projects and implementations.", image: shahidafridiImg, linkedin: "#" },
  { name: "Md.Shaifiqul Islam Moznu", role: "Electrician", description: "Expert electrician ensuring safe and efficient electrical installations and maintenance.", image: moznuImg, whatsapp: "01711301250", linkedin: "#" }
];

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center bg-[#0B1120]">
        <div className="absolute inset-0">
          <img 
            src="/images/slides/commercial_rooftop_slide_1789677880098.jpg" 
            alt="Engineering Infrastructure" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 leading-tight">
              Technology & Engineering Solutions Built for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Smarter Future</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-medium leading-relaxed max-w-2xl">
              MaxIT provides integrated technology and engineering solutions across renewable energy, smart agriculture, automation, security, networking, water treatment, communication infrastructure and building electrical systems.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="#solutions" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 flex items-center">
                Explore Our Solutions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="/MaxIT_Company_Profile.pdf" download className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/30 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Download Profile
              </a>
              <Link href="#contact" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Company Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-accent font-bold uppercase tracking-wider text-sm">About MaxIT</span>
            <h2 className="text-3xl font-bold font-heading text-primary mt-2">Engineering the Future of Infrastructure</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <p className="text-lg text-gray-700 leading-relaxed font-medium mb-6">
                MaxIT is a technology and engineering solutions company focused on delivering reliable, efficient and sustainable solutions for homes, businesses, industries and institutions. 
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                We bridge the gap between complex technological capabilities and practical implementation. From solar grid installations to fully automated smart environments, our multi-disciplinary approach ensures every project is executed to the highest engineering standards.
              </p>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "10+", label: "Years of Experience" },
                  { value: "250+", label: "Projects Completed" },
                  { value: "100+", label: "Clients Served" },
                  { value: "20+", label: "Technical Professionals" }
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <div className="text-4xl font-bold text-primary mb-2 font-heading">{stat.value}</div>
                    <div className="text-gray-600 font-medium uppercase text-sm tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Do (Our Solutions) */}
      <section id="solutions" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-wider text-sm">Our Solutions</span>
            <h2 className="text-4xl font-bold font-heading text-primary mt-2">Comprehensive Engineering Capabilities</h2>
          </div>

          {/* Core Service - Featured */}
          <div className="mb-12">
            <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
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
              <div className="lg:w-7/12 p-8 md:p-12 relative z-10 flex flex-col justify-center bg-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
                
                <div className="hidden lg:inline-block px-4 py-1.5 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-full mb-6 w-fit shadow-lg">
                  Core Service
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-inner shrink-0">
                    <Sun className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold font-heading text-white leading-tight">Comprehensive Solar Solutions</h3>
                </div>
                
                <p className="text-white/80 font-medium leading-relaxed text-lg mb-8">
                  Leading the transition to sustainable energy with end-to-end solar engineering, ensuring maximum efficiency and reliability for industrial and commercial sectors.
                </p>
                
                <div className="bg-black/10 rounded-2xl p-6 md:p-8 border border-white/5">
                  <h4 className="text-xl font-bold text-white mb-6">Key Solar Expertise:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    {[
                      { name: "Solar Installation", desc: "End-to-end design & setup" },
                      { name: "Roof Top Solar", desc: "Commercial optimization" },
                      { name: "Complete Solar Setup", desc: "Turnkey off-grid & on-grid" },
                      { name: "Net Metering", desc: "Grid synchronization" },
                      { name: "Solar Lift Integration", desc: "Heavy industrial power" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 group">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0 mt-1">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-white/90 font-bold group-hover:text-white transition-colors">{item.name}</span>
                          <span className="block text-white/60 text-xs mt-0.5">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/services" className="inline-flex items-center text-accent font-bold hover:text-white transition-colors">
                    Explore Solar Projects <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Other Services Grid */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold font-heading text-primary mb-8 text-center md:text-left border-b border-gray-200 pb-4">Technology & Infrastructure Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Cpu className="w-6 h-6" />, title: "Computer & Accessories", desc: "Enterprise-grade IT hardware supply and comprehensive computer accessories.", img: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80" },
                { icon: <Activity className="w-6 h-6" />, title: "Data Logger & IoT R&D", desc: "Custom research, development, and deployment of intelligent IoT devices and data logging systems.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
                { icon: <Settings className="w-6 h-6" />, title: "Server & Security Systems", desc: "Robust server infrastructure setup and advanced cybersecurity implementations.", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
                { icon: <Cctv className="w-6 h-6" />, title: "CCTV Surveillance", desc: "High-definition, continuous monitoring camera systems for total premises security.", img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80" },
                { icon: <Target className="w-6 h-6" />, title: "AI-Based Camera Models", desc: "Next-generation smart cameras with artificial intelligence for automated threat detection and analytics.", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80" }
              ].map((service, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 z-20 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-gray-600 font-medium leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* 4. Our Expertise */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-12">One Partner. Multiple Engineering Capabilities.</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-16">
            {['Energy', 'Automation', 'Agriculture', 'Security', 'Networking', 'Infrastructure'].map((cap, i, arr) => (
              <div key={i} className="flex items-center">
                <div className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-full text-primary font-bold text-lg shadow-sm">
                  {cap}
                </div>
                {i < arr.length - 1 && <ChevronRight className="w-6 h-6 text-gray-400 mx-2 hidden md:block" />}
              </div>
            ))}
          </div>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
            From initial consultation and system design to installation, commissioning and after-sales support, MaxIT provides end-to-end technology and engineering solutions tailored to each project.
          </p>
        </div>
      </section>

      {/* 5. Why MaxIT */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">Why Choose MaxIT?</h2>
            <p className="text-white/80 font-medium max-w-2xl mx-auto text-lg">Delivering proven value through technical excellence and integrated approaches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Target />, title: "Integrated Solutions", desc: "Multiple technology and engineering capabilities under one roof." },
              { icon: <Settings />, title: "Customized Approach", desc: "Solutions designed according to each client's technical and operational requirements." },
              { icon: <Shield />, title: "Quality Equipment", desc: "Reliable equipment and technologies selected for performance and long-term use." },
              { icon: <Briefcase />, title: "Professional Installation", desc: "Experienced technical teams for installation, configuration and commissioning." },
              { icon: <Phone />, title: "End-to-End Support", desc: "Support from consultation through implementation and maintenance." },
              { icon: <Sprout />, title: "Sustainable Solutions", desc: "Technology focused on efficiency, resource optimization and long-term value." }
            ].map((reason, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="text-accent mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold font-heading mb-3">{reason.title}</h3>
                <p className="text-white/70 font-medium leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. How We Work */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-wider text-sm">From Idea to Implementation</span>
            <h2 className="text-4xl font-bold font-heading text-primary mt-2">How We Work</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { num: "01", title: "Consultation", desc: "We understand your requirements and objectives." },
              { num: "02", title: "Site Assessment", desc: "Our team evaluates the site, infrastructure and technical requirements." },
              { num: "03", title: "Solution Design", desc: "We develop a suitable technical solution tailored to your exact needs." },
              { num: "04", title: "Proposal", desc: "We provide specifications, scope and a transparent commercial proposal." },
              { num: "05", title: "Installation & Commissioning", desc: "Our team implements, tests and commissions the system." },
              { num: "06", title: "Support", desc: "We provide ongoing technical support and proactive maintenance." }
            ].map((step, i) => (
              <div key={i} className="relative pl-8 md:pl-0">
                <div className="md:hidden absolute left-0 top-2 bottom-[-3rem] w-px bg-gray-200"></div>
                <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-accent"></div>
                
                <div className="text-5xl font-bold font-heading text-gray-100 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                  <span className="hidden md:flex w-8 h-8 rounded-full bg-primary/5 items-center justify-center text-primary text-sm mr-3">{i+1}</span>
                  {step.title}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Featured Projects */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-bold uppercase tracking-wider text-sm">Proven Success</span>
              <h2 className="text-4xl font-bold font-heading text-primary mt-2">Our Recent Projects</h2>
            </div>
            <Link href="/projects" className="hidden md:inline-flex items-center text-primary font-bold hover:text-accent transition-colors">
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row group">
                <div className="w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {project.category}
                  </div>
                </div>
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading group-hover:text-primary transition-colors">{project.title}</h3>
                  <div className="flex items-center text-sm font-medium text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-accent" /> Location Verified
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{project.shortDescription}</p>
                  <Link href={`/projects/${project.id}`} className="inline-flex items-center text-accent font-bold mt-auto group-hover:translate-x-2 transition-transform w-fit">
                    View Project <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Industries We Serve */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-primary mb-4">Solutions Across Industries</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">Delivering scalable engineering solutions for diverse sector requirements.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Home className="w-8 h-8"/>, name: "Residential" },
              { icon: <Sprout className="w-8 h-8"/>, name: "Agriculture" },
              { icon: <Building2 className="w-8 h-8"/>, name: "Commercial" },
              { icon: <Factory className="w-8 h-8"/>, name: "Industrial" },
              { icon: <GraduationCap className="w-8 h-8"/>, name: "Educational" },
              { icon: <Activity className="w-8 h-8"/>, name: "Healthcare" },
              { icon: <Settings className="w-8 h-8"/>, name: "Construction" },
              { icon: <Landmark className="w-8 h-8"/>, name: "Government" }
            ].map((ind, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-colors group cursor-default">
                <div className="text-gray-400 group-hover:text-primary transition-colors mb-4">{ind.icon}</div>
                <h4 className="font-bold text-gray-800 group-hover:text-primary">{ind.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. Partners & Certifications */}
      <section className="py-24 bg-[#0B1120] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Partners */}
            <div>
              <h3 className="text-3xl font-bold font-heading mb-8">Technology Partners</h3>
              <p className="text-gray-400 font-medium mb-10">We integrate equipment from trusted, world-class manufacturers to ensure long-term reliability.</p>
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-sm hover:bg-white/10 hover:text-white transition-colors cursor-default">
                    Brand {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-3xl font-bold font-heading mb-8">Certifications & Credentials</h3>
              <p className="text-gray-400 font-medium mb-10">Operating with full regulatory compliance and adhering to international quality standards.</p>
              <ul className="space-y-4">
                {['Trade Licenses', 'ISO Certifications', 'Electrical Licenses', 'Manufacturer Certifications'].map((cert, i) => (
                  <li key={i} className="flex items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <FileCheck className="w-6 h-6 text-accent mr-4" />
                    <span className="font-bold">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </section>

      {/* 11. Our Team */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">Meet the Team Behind MaxIT</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">Our engineering and management leaders driving innovation.</p>
          </div>

          {/* CEO Featured Row */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden border border-gray-200 hover:border-accent/40 flex flex-col md:flex-row items-center p-8 md:p-12">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 mx-auto md:mx-0 overflow-hidden rounded-full border-8 border-gray-50 shadow-lg group-hover:border-accent/20 transition-colors duration-500 z-10 bg-gray-100 mb-8 md:mb-0 md:mr-12">
                <img
                  src={team[0].image.src}
                  alt={team[0].name}
                  className="w-full h-full object-cover filter grayscale-[10%] group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
              </div>

              <div className="relative z-10 flex flex-col text-center md:text-left flex-grow">
                <p className="text-accent font-semibold tracking-wider uppercase text-lg mb-2">{team[0].role}</p>
                <h3 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                  {team[0].name}
                </h3>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-8">
                  {team[0].description}
                </p>
                <div className="flex space-x-4 pt-6 border-t border-gray-100 justify-center md:justify-start">
                  {team[0].email && (
                    <a href={`mailto:${team[0].email}`} className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl text-gray-700 hover:bg-accent hover:text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {team[0].linkedin && (
                    <a href={team[0].linkedin} className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#0077b5] hover:text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {team.slice(1).map((member, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-3xl flex flex-col h-full shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-gray-200 hover:border-accent/40"
              >
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Image Wrapper */}
                <div className="relative w-48 h-48 mx-auto mt-8 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm group-hover:border-accent/30 transition-colors duration-500 z-10 flex items-center justify-center bg-gray-50">
                  <img
                    src={member.image.src}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Content Block */}
                <div className="p-8 relative z-10 flex flex-col flex-grow bg-white">
                  <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-2 text-center">{member.role}</p>
                  <h3 className="text-2xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors duration-300 text-center">
                    {member.name}
                  </h3>
                  <p className="text-gray-700 font-medium leading-relaxed mb-6 flex-grow text-center">
                    {member.description}
                  </p>

                  {/* Social Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-100 mt-auto justify-center">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {member.whatsapp && (
                      <a
                        href={`https://wa.me/88${member.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/40 transform hover:-translate-y-1 transition-all duration-300"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={member.linkedin}
                      className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl text-gray-700 hover:bg-[#0077b5] hover:text-white hover:shadow-lg hover:shadow-[#0077b5]/40 transform hover:-translate-y-1 transition-all duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Company Numbers */}
      <section className="py-20 bg-primary text-white border-b border-primary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading">MaxIT at a Glance</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { num: "10+", label: "Years in Business" },
              { num: "250+", label: "Projects" },
              { num: "100+", label: "Clients" },
              { num: "20+", label: "Tech Experts" },
              { num: "9", label: "Categories" },
              { num: "XX+", label: "Districts" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2 font-heading text-accent">{stat.num}</div>
                <div className="text-sm font-medium text-white/80 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. CTA Section */}
      <section className="relative py-32 flex items-center justify-center bg-[#0B1120]">
        <div className="absolute inset-0">
          <img 
            src="/images/slides/agro_solar_slide_1789677870674.jpg" 
            alt="Engineering Project" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold font-heading text-white mb-6">Have a Project in Mind?</h2>
          <p className="text-xl text-gray-300 mb-10 font-medium">
            Tell us about your requirements and let our technical team help you find the right solution.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/30 text-lg flex items-center justify-center">
              Request a Consultation
            </Link>
            <a href="/MaxIT_Company_Profile.pdf" download className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 text-lg flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Download Company Profile
            </a>
            <Link href="/contact" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm text-lg flex items-center justify-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* 14. Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-primary mb-12">Let's Talk</h2>
          
          <div className="flex flex-wrap justify-center gap-12 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"><MapPin /></div>
              <h4 className="font-bold text-gray-900 mb-2">Office Address</h4>
              <p className="text-gray-600 font-medium">2nd Floor, Afroza Tower,<br/>Uposhohor Newmarket, Rajshahi-6000</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"><Phone /></div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600 font-medium">+8801733-272445</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"><Mail /></div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600 font-medium">sales@m4xit.com</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="font-bold text-gray-600 hover:text-accent transition-colors flex items-center">Google Maps <ArrowRight className="w-4 h-4 ml-1"/></a>
            <a href="#" className="font-bold text-gray-600 hover:text-accent transition-colors flex items-center">Facebook <ArrowRight className="w-4 h-4 ml-1"/></a>
            <a href="#" className="font-bold text-gray-600 hover:text-accent transition-colors flex items-center">LinkedIn <ArrowRight className="w-4 h-4 ml-1"/></a>
          </div>
        </div>
      </section>

    </div>
  );
}
