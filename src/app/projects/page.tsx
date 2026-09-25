import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

async function getProjectsData() {
  try {
    await dbConnect();
    const docs = await (Project.find as any)({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Error fetching projects:', error);
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

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjectsData(), getSiteSettings()]);
  
  const headerTitle = settings?.projectsHeaderTitle || "Our Recent Projects";
  const headerSubtitle = settings?.projectsHeaderSubtitle || "Explore our portfolio of successful implementations across solar energy, smart home automation, and agro tech.";
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-primary py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/90" />
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
            {headerTitle.split(' ').map((word: string, i: number, arr: string[]) => 
              i === arr.length - 1 ? <span key={i} className="text-accent">{word}</span> : <span key={i}>{word} </span>
            )}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans">
            {headerSubtitle}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <Link href={`/projects/${project._id}`} key={project._id} className="group h-full">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-800 mb-6 flex-grow font-sans">
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
      </div>
    </div>
  );
}
