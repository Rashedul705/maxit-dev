import Hero from '../components/Hero';
import SolarInnovation from '../components/SolarInnovation';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { Settings, ArrowRight, Sun, Sprout, Zap, Leaf, Cpu, Headphones, TrendingDown, Wifi, Cctv, Droplets, RadioTower, Lightbulb, Activity, Target, Home, Building2, Factory, GraduationCap, Landmark, Shield, Briefcase, Phone } from 'lucide-react';
import Link from "next/link";
import Partners from '../components/Partners';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import Reason from '@/models/Reason';
import HeroContent from '@/models/HeroContent';
import AboutContent from '@/models/AboutContent';
import CompanyProfileData from '@/models/CompanyProfileData';
import Service from '@/models/Service';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

async function getTestimonials() {
  try {
    await dbConnect();
    const docs = await (Testimonial.find as any)({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

async function getReasons() {
  try {
    await dbConnect();
    const docs = await (Reason.find as any)({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Error fetching reasons:', error);
    return [];
  }
}

async function getHeroContent() {
  try {
    await dbConnect();
    const doc = await (HeroContent.findOne as any)().lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
}

async function getAboutData() {
  try {
    await dbConnect();
    const doc = await (AboutContent.findOne as any)().lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : { journey: 'Leading technology and engineering solutions provider.' };
  } catch (error) {
    return { journey: 'Leading technology and engineering solutions provider.' };
  }
}

async function getCompanyProfileData() {
  try {
    await dbConnect();
    const doc = await (CompanyProfileData.findOne as any)().lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : { stats: [] };
  } catch (error) {
    return { stats: [] };
  }
}

async function getServicesData() {
  try {
    await dbConnect();
    const docs = await (Service.find as any)({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    return [];
  }
}

async function getTeamData() {
  try {
    await dbConnect();
    let ceoDoc = await (TeamMember.findOne as any)({ isCeo: true }).lean();
    let allMembers = await (TeamMember.find as any)({ isCeo: false }).sort({ order: 1 }).lean();
    
    // Fallback: extract CEO
    if (!ceoDoc) {
      const ceoIndex = allMembers.findIndex((m: any) => m.name.toLowerCase().includes('zahangir') || (m.officialTitle && m.officialTitle.toLowerCase().includes('ceo')));
      if (ceoIndex !== -1) {
        ceoDoc = allMembers[ceoIndex];
        allMembers.splice(ceoIndex, 1);
      }
    }

    const chairman = allMembers.find((m: any) => m.name.toLowerCase().includes('subnom') || (m.officialTitle && m.officialTitle.toLowerCase().includes('chair')));
    const sarwer = allMembers.find((m: any) => m.name.toLowerCase().includes('sarwer') || (m.officialTitle && m.officialTitle.toLowerCase().includes('director') && m.officialTitle.toLowerCase().includes('iot')));
    
    // Fallback for third member if Sarwer Jahan is not found
    const thirdMember = sarwer || allMembers.find((m: any) => m.officialTitle && m.officialTitle.toLowerCase().includes('director')) || allMembers[0];
    
    const ceo = JSON.parse(JSON.stringify(ceoDoc || null));
    if (ceo) {
      ceo.officialTitle = "Chief Executive Officer (CEO)";
      ceo.functionalDesignation = " "; // Prevent fallback text
    }

    const chairmanObj = JSON.parse(JSON.stringify(chairman || null));
    if (chairmanObj) {
      chairmanObj.officialTitle = "Chairperson Of The Board";
      chairmanObj.functionalDesignation = " ";
    }

    const thirdMemberObj = JSON.parse(JSON.stringify(thirdMember || null));
    if (thirdMemberObj) {
      thirdMemberObj.officialTitle = "Director - Automation & IoT";
      thirdMemberObj.functionalDesignation = " ";
    }

    const others = [chairmanObj, thirdMemberObj].filter(Boolean);
    
    return [ceo, ...others].filter(Boolean);
  } catch (error) {
    return [];
  }
}

const Index = async () => {
  const testimonials = await getTestimonials();
  const reasonsData = await getReasons();
  const heroContent = await getHeroContent();
  const aboutData = await getAboutData();
  const profileData = await getCompanyProfileData();
  const teamMembers = await getTeamData();
  let services = await getServicesData();
  if (services.length === 0) {
    services = [
      { title: "Solar Home Systems", description: "Complete solar energy solutions for residential use.", iconCategory: "Sun" },
      { title: "Solar Pump & Smart Irrigation", description: "Advanced solar-powered pumping systems.", iconCategory: "Sprout" },
      { title: "Industrial Automation", description: "Smart control systems for industries.", iconCategory: "Cpu" },
      { title: "Networking Services", description: "Robust network infrastructure design.", iconCategory: "Wifi" }
    ];
  }

  const stats = profileData?.stats?.length > 0 ? profileData.stats : [
    { value: "50+", label: "Total Rooftop Solar Power" },
    { value: "30+", label: "Solar Irrigation Pumps" },
    { value: "10+", label: "Off-Grid Solar Systems" },
    { value: "24/7", label: "Nationwide Support" }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 animate-slide-up overflow-hidden w-full">
      <Hero content={heroContent} />

      {/* How We Power Your Solar Journey */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
            How We Power Your <span className="font-bold text-primary">Solar Journey</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed">
            From planning to performance, our services ensure your solar investment delivers maximum efficiency, reliability, and long-term value.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200 rounded-2xl overflow-hidden bg-white">
            {[
              { title: "Solar Energy", description: "Expert installation ensuring optimal performance, safety, and long-term reliability across residential, commercial, and industrial solar projects.", icon: <Sun className="w-8 h-8 text-primary" /> },
              { title: "Irrigation & Water", description: "Advanced solar-powered pumping systems integrated with smart technology for highly efficient agricultural water management.", icon: <Droplets className="w-8 h-8 text-primary" /> },
              { title: "IT & Networking", description: "Robust network infrastructure design and reliable high-speed connectivity solutions for businesses and organizations.", icon: <Wifi className="w-8 h-8 text-primary" /> },
              { title: "Automation & Civil Works", description: "Intelligent control systems and structural civil engineering services to modernize your operational infrastructure.", icon: <Settings className="w-8 h-8 text-primary" /> },
              { title: "Power & Electrical", description: "Comprehensive electrical planning, wiring, and safe power distribution services for diverse project scales.", icon: <Zap className="w-8 h-8 text-primary" /> },
              { title: "CCTV Surveillance", description: "Professional IP camera systems and advanced surveillance solutions providing reliable 24/7 security monitoring.", icon: <Cctv className="w-8 h-8 text-primary" /> },
            ].map((service, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center p-10 group transition-colors hover:bg-gray-50/50 ${
                  index % 3 !== 2 ? 'md:border-r border-gray-200' : ''
                } ${index < 3 ? 'border-b border-gray-200' : ''} ${index >= 3 && index < 5 ? 'border-b md:border-b-0 border-gray-200' : ''}`}
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-colors mb-6 shadow-sm">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones / Stats */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-12">Milestones That Define Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-5xl font-bold text-accent mb-4 font-heading">{stat.value}</div>
                <div className="text-white/80 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions We Deliver */}
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
            {reasonsData.map((reason: any, index: number) => {
              const iconMap: Record<string, React.ReactNode> = {
                Sun: <Sun className="w-8 h-8" />,
                Settings: <Settings className="w-8 h-8" />,
                Leaf: <Leaf className="w-8 h-8" />,
                Cpu: <Cpu className="w-8 h-8" />,
                Headphones: <Headphones className="w-8 h-8" />,
                TrendingDown: <TrendingDown className="w-8 h-8" />,
                Activity: <Activity className="w-8 h-8" />,
                Cctv: <Cctv className="w-8 h-8" />,
                Target: <Target className="w-8 h-8" />,
                Home: <Home className="w-8 h-8" />,
                Sprout: <Sprout className="w-8 h-8" />,
                Building2: <Building2 className="w-8 h-8" />,
                Factory: <Factory className="w-8 h-8" />,
                GraduationCap: <GraduationCap className="w-8 h-8" />,
                Landmark: <Landmark className="w-8 h-8" />
              };
              return (
              <div 
                key={reason._id} 
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${reason.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out`} />
                
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center text-white mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {iconMap[reason.iconCategory] || <Settings className="w-8 h-8" />}
                </div>
                
                <h3 className="relative z-10 text-2xl font-bold font-heading text-primary mb-3">{reason.title}</h3>
                <p className="relative z-10 text-gray-700 leading-relaxed font-medium">{reason.description}</p>
              </div>
            )})}
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

      {/* About Summary Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img src="/images/slides/agro_solar_slide_1789677870674.jpg" alt="About MaxIT" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/10 rounded-full blur-[40px] -z-10"></div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">About MaxIT Solution</h2>
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-10">
                {aboutData.journey || "We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/30 group transform hover:-translate-y-1"
                >
                  Discover Our Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/company-profile"
                  className="inline-flex items-center px-8 py-4 bg-white border border-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm group transform hover:-translate-y-1"
                >
                  Company Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/50 rounded-full blur-[150px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Don't just take our word for it — hear from the visionaries who have experienced the MaxIT difference firsthand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any) => (
              <TestimonialCard 
                key={testimonial._id} 
                name={testimonial.name}
                company={testimonial.company}
                testimonial={testimonial.testimonial}
                rating={testimonial.rating}
                image={testimonial.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />

      {/* Team Preview Section */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-24 bg-[#141F4E] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
                MaxIT Management
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                Meet the visionary leaders driving our technology and engineering solutions forward.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-10">
              {teamMembers.map((member: any) => (
                <div key={member._id} className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 mb-8 rounded-full border-[8px] border-gray-50 overflow-hidden shadow-sm">
                    <img 
                      src={member.photoUrl || member.image || "/images/placeholder.jpg"} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{member.name}</h3>
                  <p className="text-base font-semibold text-[#0f52ba] mb-1">{member.officialTitle}</p>
                  {member.functionalDesignation?.trim() && (
                    <p className="text-sm text-gray-500">{member.functionalDesignation}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/team"
                className="inline-flex items-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm group"
              >
                View Full Team
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden flex items-center justify-center min-h-[500px] bg-primary">
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/slides/commercial_rooftop_slide_1789677880098.jpg')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent" />
        </div>

        {/* Dynamic Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        
        {/* Glassmorphism Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-16 rounded-[2rem] shadow-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6 tracking-tight">
              Ready to Power Your Future?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Let's work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-primary hover:bg-gray-50 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <span className="relative z-10 text-lg">Get Started Today</span>
                <ArrowRight className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-lg"
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
