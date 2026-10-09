import Hero from '../components/Hero';
import SolarInnovation from '../components/SolarInnovation';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import { Settings, ArrowRight, Sun, Sprout, Zap, Leaf, Cpu, Headphones, TrendingDown, Wifi, Cctv, Droplets, RadioTower, Lightbulb, Activity, Target, Home, Building2, Factory, GraduationCap, Landmark, Shield, Briefcase, Phone, CheckCircle2, Image as ImageIcon, ShieldCheck, Headset } from 'lucide-react';
import Link from "next/link";
import Partners from '../components/Partners';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import Reason from '@/models/Reason';
import HomeContent from '@/models/HomeContent';
import AboutContent from '@/models/AboutContent';
import CompanyProfileData from '@/models/CompanyProfileData';
import Service from '@/models/Service';
import TeamMember from '@/models/TeamMember';
import SiteSettings from '@/models/SiteSettings';

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

async function getHomeData() {
  try {
    await dbConnect();
    const doc = await (HomeContent.findOne as any)().lean();
    if (!doc) {
      // Return hardcoded default if empty
      return null;
    }
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error fetching home content:', error);
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

async function getSiteSettings() {
  try {
    await dbConnect();
    const doc = await (SiteSettings.findOne as any)().lean();
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch (error) {
    return null;
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
  const homeData = await getHomeData();
  const aboutData = await getAboutData();
  const profileData = await getCompanyProfileData();
  const teamMembers = await getTeamData();
  const siteSettings = await getSiteSettings();
  let services = await getServicesData();

  // The sections will use homeData if present, falling back to old hardcoded stuff if undefined
  
  // Services fallback (from db) or old default
  if (services.length === 0) {
    services = [
      { title: "Solar Home Systems", description: "Complete solar energy solutions for residential use.", iconCategory: "Sun" },
      { title: "Solar Pump & Smart Irrigation", description: "Advanced solar-powered pumping systems.", iconCategory: "Sprout" },
      { title: "Industrial Automation", description: "Smart control systems for industries.", iconCategory: "Cpu" },
      { title: "Networking Services", description: "Robust network infrastructure design.", iconCategory: "Wifi" }
    ];
  }



  const displayStats = homeData?.milestones?.stats?.length > 0 
    ? [...homeData.milestones.stats].sort((a:any, b:any) => a.order - b.order)
    : (profileData?.stats?.length > 0 ? profileData.stats : [
        { value: "50+", label: "Total Rooftop Solar Power" },
        { value: "30+", label: "Solar Irrigation Pumps" },
        { value: "10+", label: "Off-Grid Solar Systems" },
        { value: "24/7", label: "Nationwide Support" }
      ]);

  const displayReasons = homeData?.whyChooseUs?.cards?.length > 0
    ? [...homeData.whyChooseUs.cards].sort((a:any, b:any) => a.order - b.order)
    : reasonsData;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]"><main className="flex-1 animate-slide-up overflow-hidden w-full">
      {(!homeData || homeData.hero?.visible !== false) && (
        <Hero content={homeData?.hero} siteSettings={siteSettings} />
      )}

      {(!homeData || homeData.servicesSection?.visible !== false) && (
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
            {homeData?.servicesSection?.headingNormal || "Everything You Need, Under "}<span className="font-bold text-primary">{homeData?.servicesSection?.headingHighlight || "One Roof"}</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed">
            {homeData?.servicesSection?.subtext || "From solar and irrigation to networking, automation, electrical work, and CCTV, we handle the full job so you deal with one reliable team."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            {services.map((service: any, index: number) => {
              const iconMap: Record<string, React.ReactNode> = {
                Cpu: <Cpu className="w-8 h-8 text-primary" />,
                Activity: <Activity className="w-8 h-8 text-primary" />,
                Settings: <Settings className="w-8 h-8 text-primary" />,
                Cctv: <Cctv className="w-8 h-8 text-primary" />,
                Target: <Target className="w-8 h-8 text-primary" />,
                Home: <Home className="w-8 h-8 text-primary" />,
                Sprout: <Sprout className="w-8 h-8 text-primary" />,
                Building2: <Building2 className="w-8 h-8 text-primary" />,
                Factory: <Factory className="w-8 h-8 text-primary" />,
                GraduationCap: <GraduationCap className="w-8 h-8 text-primary" />,
                Landmark: <Landmark className="w-8 h-8 text-primary" />,
                Sun: <Sun className="w-8 h-8 text-primary" />,
                Wifi: <Wifi className="w-8 h-8 text-primary" />,
                Droplets: <Droplets className="w-8 h-8 text-primary" />,
                Zap: <Zap className="w-8 h-8 text-primary" />,
              };
              
              return (
              <div 
                key={service._id || index} 
                className="flex flex-col items-center p-10 group transition-colors hover:bg-gray-50/50 bg-white text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition-colors mb-6 shadow-sm overflow-hidden">
                  {service.iconUrl ? (
                    <img src={service.iconUrl} alt={service.title} className="w-10 h-10 object-contain" />
                  ) : (
                    (service.iconCategory || service.icon) && iconMap[service.iconCategory || service.icon] ? iconMap[service.iconCategory || service.icon] : <Settings className="w-8 h-8 text-primary" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                {service.subServices && service.subServices.length > 0 && (
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    {service.subServices.join(" • ")}
                  </p>
                )}
              </div>
            )})}
          </div>
        </div>
      </section>
      )}

      {/* Milestones / Stats */}
      {(!homeData || homeData.milestones?.visible !== false) && (
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-12">{homeData?.milestones?.title || "Milestones That Define Our Impact"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-5xl font-bold text-white mb-4 font-heading drop-shadow-md">{stat.value || stat.number}</div>
                <div className="text-white/90 font-semibold uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Solutions We Deliver */}
      {(!homeData || homeData.videosSection?.visible !== false) && (
        <SolarInnovation content={homeData?.videosSection} />
      )}

      {/* About Section */}
      {(!homeData || homeData.whyChooseUs?.visible !== false) && (
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              {homeData?.whyChooseUs?.headingNormal || "Why Choose "}<span className="text-primary">{homeData?.whyChooseUs?.headingHighlight || "Max iT Solution?"}</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
              {homeData?.whyChooseUs?.subtext || "We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-16">
            {displayReasons.map((reason: any, index: number) => {
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
                Landmark: <Landmark className="w-8 h-8" />,
                ShieldCheck: <ShieldCheck className="w-8 h-8" />,
                Headset: <Headset className="w-8 h-8" />,
                Zap: <Zap className="w-8 h-8" />
              };
              
              // Ensure Tailwind compiles dynamic gradient classes
              const _tw = "from-green-500 to-emerald-500 from-blue-500 to-indigo-500 from-yellow-400 to-orange-500 from-purple-500 to-pink-500 from-blue-500 to-cyan-500";
              return (
              <div 
                key={index} 
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${reason.gradient || reason.accentColor || 'from-blue-500 to-cyan-500'} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out`} />
                
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient || reason.accentColor || 'from-blue-500 to-cyan-500'} flex items-center justify-center text-white mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden`}>
                  {reason.isCustomIcon ? (
                    <img src={reason.icon} alt={reason.title} className="w-10 h-10 object-contain drop-shadow-md" />
                  ) : (
                    iconMap[reason.iconCategory || reason.icon] || <Settings className="w-8 h-8" />
                  )}
                </div>
                
                <h3 className="relative z-10 text-2xl font-bold font-heading text-primary mb-3">{reason.title}</h3>
                <p className="relative z-10 text-gray-700 leading-relaxed font-medium">{reason.description}</p>
              </div>
            )})}
          </div>

          <div className="text-center">
            <Link
              href={homeData?.whyChooseUs?.button?.link || "/about"}
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {homeData?.whyChooseUs?.button?.label || "Learn More About Us"}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* About Summary Section */}
      {(!homeData || homeData.aboutPreview?.visible !== false) && (
      <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img src={homeData?.aboutPreview?.image || "/images/slides/agro_solar_slide_1789677870674.jpg"} alt="About Max iT" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/10 rounded-full blur-[40px] -z-10"></div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
                {homeData?.aboutPreview?.headingNormal || "About "}<span className="text-primary">{homeData?.aboutPreview?.headingHighlight || "Max iT Solution"}</span>
              </h2>
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-10">
                {homeData?.aboutPreview?.paragraph || aboutData.journey || "We are dedicated to empowering businesses and homes with sustainable energy, advanced agricultural technology, and smart automation solutions."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={homeData?.aboutPreview?.primaryButton?.link || "/about"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/30 group transform hover:-translate-y-1"
                >
                  {homeData?.aboutPreview?.primaryButton?.label || "Discover Our Journey"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={homeData?.aboutPreview?.secondaryButton?.link || "/company-profile"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm group transform hover:-translate-y-1"
                >
                  {homeData?.aboutPreview?.secondaryButton?.label || "Company Profile"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials Section */}
      {(!homeData || homeData.testimonialsSection?.visible !== false) && (
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/50 rounded-full blur-[150px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
              {homeData?.testimonialsSection?.headingNormal || "Client "}<span className="text-primary">{homeData?.testimonialsSection?.headingHighlight || "Success Stories"}</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              {homeData?.testimonialsSection?.subtext || "Don't just take our word for it — hear from the visionaries who have experienced the Max iT difference firsthand."}
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
      )}

      {/* Partners Section */}
      {(!homeData || homeData.partnersSection?.visible !== false) && (
        <Partners content={homeData?.partnersSection} />
      )}

      {/* Team Preview Section */}
      {(!homeData || homeData.teamSection?.visible !== false) && teamMembers && teamMembers.length > 0 && (
        <section className="py-24 bg-[#141F4E] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {homeData?.teamSection?.headingNormal || "Max iT "}<span className="text-blue-400">{homeData?.teamSection?.headingHighlight || "Management"}</span>
              </h2>
              <p className="text-lg text-gray-300/80 max-w-2xl mx-auto font-medium">
                {homeData?.teamSection?.subtext || "Meet the leaders driving our technology and engineering solutions forward."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-8">
              {teamMembers.map((member: any) => {
                return (
                  <div key={member._id} className="bg-[#17223b] rounded-2xl p-10 border border-[#263456] flex flex-col items-center text-center shadow-lg transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-32 h-32 mb-6 rounded-full border-4 border-blue-500/80 bg-[#0d162a] overflow-hidden shadow-inner">
                      <img 
                        src={member.photoUrl || member.image || "/images/placeholder.jpg"} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-6">
                      {member.name.replace('Engr. Md Zahangir Alam', 'Engr. Zahangir Alam (Sobuj)')}
                    </h3>
                    
                    <div className="mt-auto">
                      <span className="inline-block px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold tracking-wide">
                        {member.officialTitle || member.functionalDesignation}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-14">
              <Link
                href={homeData?.teamSection?.button?.link || "/team"}
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
              >
                {homeData?.teamSection?.button?.label || "View full team"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {(!homeData || homeData.ctaSection?.visible !== false) && (
      <section className="py-24 relative overflow-hidden flex items-center justify-center min-h-[500px] bg-primary">
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity" style={{ backgroundImage: `url('${homeData?.ctaSection?.backgroundImage || "/images/slides/commercial_rooftop_slide_1789677880098.jpg"}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent" />
        </div>

        {/* Dynamic Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        
        {/* Glassmorphism Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-16 rounded-[2rem] shadow-2xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6 tracking-tight">
              {homeData?.ctaSection?.title || "Ready to Power Your Future?"}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              {homeData?.ctaSection?.text || "Let's work together to implement sustainable and intelligent solutions that scale with your ambitions. Get in touch with us today!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={homeData?.ctaSection?.primaryButton?.link || siteSettings?.footerContactButtonLink || "/contact"}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-primary hover:bg-gray-50 font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <span className="relative z-10 text-lg">{homeData?.ctaSection?.primaryButton?.label || "Get Started Today"}</span>
                <ArrowRight className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={homeData?.ctaSection?.secondaryButton?.link || "/services"}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-lg"
              >
                {homeData?.ctaSection?.secondaryButton?.label || "View Our Work"}
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </main></div>
  );
};

export default Index;
