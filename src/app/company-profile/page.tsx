import Link from 'next/link';
import { 
  ArrowRight, ChevronRight, MapPin, Phone, Mail, 
  Sun, Droplets, Sprout, Cpu, Wifi, Cctv, RadioTower, Lightbulb, 
  Target, Shield, Settings, Home, Factory, Building2,
  GraduationCap, Activity, Landmark, Briefcase, FileCheck
} from 'lucide-react';
import { projects } from '@/lib/projects';

// Dummy Team Data (Can be replaced with real data)
const team = [
  { name: "Sobuj Ali", role: "Managing Director", image: "/images/team/ceo-maxit.png" },
  { name: "Shohidul Islam", role: "Chief Engineer", image: "/images/team/shohid.jpg" },
  { name: "Moznu Mia", role: "Project Manager", image: "/images/team/moznu.jpg" },
  { name: "Rashedul Islam", role: "Technical Lead", image: "/images/team/rashedul.jpg" }
];

export default function CompanyProfile() {
  return (
    <div className="min-h-screen bg-white pt-16">
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center bg-[#0B1120]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop" 
            alt="Engineering Infrastructure" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
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
            <div className="flex flex-wrap gap-4">
              <Link href="#solutions" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 flex items-center">
                Explore Our Solutions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Sun />, title: "Solar Home Systems", desc: "Reliable solar power solutions for residential and commercial applications." },
              { icon: <Droplets />, title: "Solar Pump & Smart Irrigation", desc: "Solar-powered pumping and intelligent irrigation solutions for agriculture." },
              { icon: <Sprout />, title: "Agro Technology", desc: "Technology-driven solutions for smarter and more efficient farming." },
              { icon: <Cpu />, title: "Industrial & Home Automation", desc: "Automation solutions designed to improve efficiency, comfort and control." },
              { icon: <Wifi />, title: "Networking & Internet Services", desc: "Reliable network infrastructure, connectivity and communication systems." },
              { icon: <Cctv />, title: "CCTV Security Systems", desc: "Modern surveillance and security solutions for homes, businesses and institutions." },
              { icon: <Activity />, title: "Water Treatment Solutions", desc: "Water purification, filtration and treatment systems for different applications." },
              { icon: <RadioTower />, title: "Communication Infrastructure", desc: "Infrastructure solutions for reliable data and communication networks." },
              { icon: <Lightbulb />, title: "Building Electrical Engineering", desc: "Electrical design, installation, distribution and engineering solutions." },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-gray-600 mb-6 font-medium leading-relaxed">{service.desc}</p>
                <Link href="/services" className="inline-flex items-center text-accent font-bold hover:text-primary transition-colors">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-primary mb-4">Meet the Team Behind MaxIT</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">Our engineering and management leaders driving innovation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-100 aspect-[3/4]">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                <p className="text-accent font-medium">{member.role}</p>
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
            src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop" 
            alt="Engineering Project" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold font-heading text-white mb-6">Have a Project in Mind?</h2>
          <p className="text-xl text-gray-300 mb-10 font-medium">
            Tell us about your requirements and let our technical team help you find the right solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/30 text-lg">
              Request a Consultation
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm text-lg">
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
