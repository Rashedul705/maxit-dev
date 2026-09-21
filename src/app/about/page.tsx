import { 
  ArrowRight, Target, Eye, Shield, Users, MapPin, 
  Phone, Mail, Globe, Award, CheckCircle2, Star, 
  Zap, Building, TrendingUp, Cpu, Leaf, Wrench,
  Facebook, Twitter, Linkedin, ChevronRight, Activity, MessageCircle,
  Sun, Sprout, Wifi, Cctv, Droplets, RadioTower, Lightbulb
} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
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

const About = () => {
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

  const teamMembers = [
    {
      name: "Engr. Zahangir Alam (Sobuj)",
      role: "Chief Executive Officer",
      description: "Visionary leader driving innovation and sustainable solutions at Max IT Solution LTD.",
      image: sobujImg,
      email: "ceo@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Rupali",
      role: "Project Director",
      description: "Experienced project director ensuring successful execution and delivery of our initiatives.",
      image: rupaliImg,
      email: "rupali@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Sarwar Jahan",
      role: "Software Engineer",
      description: "Expert software engineer developing robust and scalable digital solutions.",
      image: shohidImg,
      email: "shohid@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Rashedul Islam",
      role: "Software Engineer",
      description: "BSc in Computer Science and Engineering. Dedicated to building scalable and robust software solutions.",
      image: rashedulImg,
      email: "rashedul.afl@gmail.com",
      linkedin: "https://www.linkedin.com/in/rislam05/"
    },
    {
      name: "Tauhidur Rahman Rony",
      role: "Adviser",
      description: "Strategic adviser providing expert guidance on business development and operations.",
      image: touhidurImg,
      email: "rony@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Priyanka Roy",
      role: "Senior Executive",
      description: "Dedicated senior executive managing key administrative and operational functions.",
      image: priyankaImg,
      email: "sales@m4xit.com",
      linkedin: "#"
    },
    {
      name: "Md. Emon Ali",
      role: "Assistant Engineer",
      description: "Skilled assistant engineer supporting our technical projects and implementations.",
      image: emonImg,
      email: "emon@m4xit.com",
      linkedin: "#"
    },
    {
      name: "MD .SHAHID AFRIDI",
      role: "Maintaince Engineer",
      description: "Skilled Maintaince Engineer supporting our technical projects and implementations.",
      image: shahidafridiImg,
      linkedin: "#"
    },
    {
      name: "Md.Shaifiqul Islam Moznu",
      role: "Electrician",
      description: "Expert electrician ensuring safe and efficient electrical installations and maintenance.",
      image: moznuImg,
      whatsapp: "01711301250",
      linkedin: "#"
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
            <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
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
                <p className="text-gray-800 leading-relaxed font-medium text-lg">
                  Max IT Solution LTD. is an advanced technology solution provider specializing in sustainable energy and industrial automation. We provide comprehensive engineering support guaranteed to bring robust, measurable scalability to modern infrastructure.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-primary mb-1 flex items-center"><Building className="w-4 h-4 mr-2 text-accent"/> Established</h4>
                    <p className="text-gray-700 font-medium">2014</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2 text-accent"/> Headquarters</h4>
                    <p className="text-gray-700 font-medium">Rajshahi-6000</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-bold text-primary mb-1 flex items-center"><Award className="w-4 h-4 mr-2 text-accent"/> Tagline</h4>
                    <p className="text-gray-700 font-medium italic">"Innovating Infrastructure for a Sustainable Tomorrow"</p>
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
                <p className="text-gray-800 font-medium leading-relaxed">
                  To provide reliable, innovative, and sustainable solutions that address real-world challenges faced by businesses globally, ensuring maximum ROI through cutting-edge engineering and unparalleled technical support.
                </p>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Eye className="w-12 h-12 text-primary mb-6 bg-primary/10 p-2 rounded-2xl" />
                <h3 className="text-2xl font-bold font-heading text-primary mb-4">Our Vision</h3>
                <p className="text-gray-800 font-medium leading-relaxed">
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
                    <p className="text-primary-foreground/70 text-sm font-medium">{value.desc}</p>
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
              <p className="text-gray-700 font-medium text-lg mb-6">Comprehensive solutions tailored for modern industrial needs.</p>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
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
                  <p className="text-primary-foreground/80 font-medium text-lg mb-8 leading-relaxed">
                    We don't just deliver projects; we build long-term partnerships. Our unique approach ensures your infrastructure is always optimized for peak performance.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Decades of combined engineering expertise",
                      "Guaranteed 24/7 post-installation support",
                      "Cost-effective, scalable solutions",
                      "Commitment to sustainable and green technologies"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center text-lg font-medium">
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
                    { number: "100%", label: "Client Satisfaction" }
                  ].map((stat, idx) => (
                     <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10 text-center hover:bg-white/20 transition-colors duration-300">
                        <h4 className="text-4xl font-bold text-white mb-2">{stat.number}</h4>
                        <p className="text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                     </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* 6. Leadership Team */}
        <section className="py-24 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">
                Our Key Professionals
              </h2>
              <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
              {teamMembers.map((member, index) => (
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
                    <h3 className="text-xl font-bold font-heading text-primary mb-3 group-hover:text-accent transition-colors duration-300 text-center">
                      {member.name}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed mb-6 flex-grow text-center">
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
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Portfolio & Social Proof */}
        <section className="py-24 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Our Recent Projects</h2>
                  <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-10"></div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                  {projects.slice(0, 3).map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="group h-full">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 transform hover:-translate-y-1">
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 z-20">
                            <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-grow relative">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-800 mb-6 flex-grow font-sans text-sm">
                            {project.shortDescription}
                          </p>
                          <div className="flex items-center text-accent font-medium mt-auto group-hover:translate-x-2 transition-transform">
                            <span>View Details</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Client Success Stories</h2>
                  <div className="w-20 h-1 bg-accent rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
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
                  <p className="text-primary-foreground/80 mb-10 font-medium leading-relaxed">
                    Ready to transform your infrastructure? Contact us today to discuss your next project.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center text-white">
                      <MapPin className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-medium">2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Phone className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-medium">+88 01724-958474</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Mail className="w-6 h-6 text-accent mr-4 shrink-0" />
                      <span className="font-medium">sales@m4xit.com</span>
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
                  <p className="text-gray-800 mb-8 font-medium">Fill out our contact form and our team will get back to you within 24 hours.</p>
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
