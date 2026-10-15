import Link from "next/link";
import { 
  Sun, ArrowRight, Cpu, Activity, Settings, Cctv, Target, Droplets, Sprout, Leaf, Wifi, RadioTower, Lightbulb, Home, Building2, Factory, GraduationCap, Landmark, Zap, CheckCircle2, Image as ImageIcon 
} from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

async function getServicesData() {
  try {
    await dbConnect();
    const servicesDocs = await (Service.find as any)({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(servicesDocs));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getSiteSettings() {
  try {
    await dbConnect();
    const settings = await (SiteSettings.findOne as any)().lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export default async function Services() {
  const [services, settings] = await Promise.all([getServicesData(), getSiteSettings()]);
  
  const iconMap: Record<string, React.ReactNode> = {
    Cpu: <Cpu className="w-10 h-10" />,
    Activity: <Activity className="w-10 h-10" />,
    Settings: <Settings className="w-10 h-10" />,
    Cctv: <Cctv className="w-10 h-10" />,
    Target: <Target className="w-10 h-10" />,
    Home: <Home className="w-10 h-10" />,
    Sprout: <Sprout className="w-10 h-10" />,
    Building2: <Building2 className="w-10 h-10" />,
    Factory: <Factory className="w-10 h-10" />,
    GraduationCap: <GraduationCap className="w-10 h-10" />,
    Landmark: <Landmark className="w-10 h-10" />,
    Sun: <Sun className="w-10 h-10" />,
    Wifi: <Wifi className="w-10 h-10" />,
    Droplets: <Droplets className="w-10 h-10" />,
    Zap: <Zap className="w-10 h-10" />,
  };

  const headerTitle = settings?.servicesHeaderTitle || "Our Services";
  const headerSubtitle = settings?.servicesHeaderSubtitle || "Comprehensive technology and engineering solutions designed for efficiency, sustainability, and growth.";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              {headerTitle.split(' ').map((word: string, i: number, arr: string[]) => 
                i === arr.length - 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{word}</span> : <span key={i}>{word} </span>
              )}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              {headerSubtitle}
            </p>
          </div>
        </section>

        {/* Services Content Area - Grid Layout */}
        <section className="pb-24 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: any) => {
                const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                
                return (
                  <div 
                    key={service._id} 
                    className={`flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative ${
                      service.title.toLowerCase().includes('solar') ? 'ring-2 ring-primary border-transparent' : ''
                    }`}
                  >
                    {service.title.toLowerCase().includes('solar') && (
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
                        CORE SERVICE
                      </div>
                    )}
                    
                    {/* Cover Image Header */}
                    <div className="h-48 overflow-hidden relative border-b border-gray-100 rounded-t-2xl">
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-300">
                          <ImageIcon className="w-12 h-12 opacity-50 mb-2" />
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Icon overlay on the edge of the image */}
                    <div className="absolute top-40 left-8 z-20 w-16 h-16 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300 overflow-hidden border border-gray-100">
                      {service.iconUrl ? (
                        <img src={service.iconUrl} alt="Icon" className="w-10 h-10 object-contain" />
                      ) : (
                        service.iconCategory && iconMap[service.iconCategory] ? iconMap[service.iconCategory] : <ImageIcon className="w-8 h-8 opacity-50" />
                      )}
                    </div>
                    
                    <div className="p-8 pt-12 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 font-heading">{service.title}</h3>
                    
                    {/* Sub Services */}
                    {service.subServices && service.subServices.length > 0 && (
                      <div className="mb-8 flex-grow">
                        <ul className="space-y-3">
                          {service.subServices.map((sub: string, subIdx: number) => (
                            <li key={subIdx} className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm font-medium">{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                      <Link 
                        href={`/projects?category=${slugify(service.title)}`} 
                        className="flex-1 text-center py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 text-sm font-bold rounded-xl transition-colors border border-gray-200"
                      >
                        View Projects
                      </Link>
                      <Link 
                        href="/contact" 
                        className="flex-1 text-center py-2.5 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        Consult Us
                      </Link>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
