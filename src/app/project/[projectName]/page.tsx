import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, CheckCircle2, MapPin, Building, ChevronRight, Zap, Clock, Battery } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectName: string }> }) {
  const { projectName } = await params;
  const decodedName = decodeURIComponent(projectName);

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  await dbConnect();
  let project = null;
  let nextProject = null;
  try {
    const allProjects = await Project.find({}).sort({ order: 1, _id: 1 }).lean();
    
    const found = allProjects.find((p: any) => 
      slugify(p.title) === decodedName || p.title === decodedName
    );

    if (found) {
      project = JSON.parse(JSON.stringify(found));
      
      const currentIndex = allProjects.findIndex((p: any) => p._id.toString() === found._id.toString());
      let next = allProjects[currentIndex + 1];
      
      if (!next && allProjects.length > 1) {
        next = allProjects[0]; // loop back to first
      }
      
      if (next && next._id.toString() !== found._id.toString()) {
        nextProject = JSON.parse(JSON.stringify(next));
      }
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-0">
      {/* Hero Image Section */}
      <div className="w-full h-[50vh] md:h-[70vh] relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-16">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading shadow-sm leading-tight">
              {project.title}
            </h1>
            <span className="inline-block bg-accent text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              {project.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30 mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          
          <div className="mb-8">
            <Link href="/projects" className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>

          {/* Key Numbers / Stats */}
          {project.stats && (project.stats.capacityInstalled || project.stats.energySaved || project.stats.projectDuration) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-gray-100">
              {project.stats.capacityInstalled && (
                <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl text-center">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <span className="text-3xl font-bold text-gray-900 mb-1">{project.stats.capacityInstalled}</span>
                  <span className="text-sm text-gray-600 font-medium uppercase tracking-wider">Capacity Installed</span>
                </div>
              )}
              {project.stats.energySaved && (
                <div className="flex flex-col items-center justify-center p-6 bg-accent/5 rounded-2xl text-center">
                  <Battery className="h-8 w-8 text-accent mb-3" />
                  <span className="text-3xl font-bold text-gray-900 mb-1">{project.stats.energySaved}</span>
                  <span className="text-sm text-gray-600 font-medium uppercase tracking-wider">Energy Saved</span>
                </div>
              )}
              {project.stats.projectDuration && (
                <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl text-center">
                  <Clock className="h-8 w-8 text-green-600 mb-3" />
                  <span className="text-3xl font-bold text-gray-900 mb-1">{project.stats.projectDuration}</span>
                  <span className="text-sm text-gray-600 font-medium uppercase tracking-wider">Project Duration</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Project Overview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Project Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Challenge & Solution */}
              {(project.challenge || project.solution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {project.challenge && (
                    <div className="bg-red-50/50 rounded-xl p-6 border border-red-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 text-sm">01</span>
                        The Challenge
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="bg-green-50/50 rounded-xl p-6 border border-green-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">02</span>
                        The Solution
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Scope of Work */}
              {project.scopeOfWork && project.scopeOfWork.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Scope of Work</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.scopeOfWork.map((item: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>

            {/* Sidebar Details */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-heading border-b border-gray-200 pb-4">Project Details</h3>
                
                <div className="space-y-5">
                  {project.client && (
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-accent mr-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-0.5">Client</p>
                        <p className="text-gray-900 font-semibold">{project.client}</p>
                      </div>
                    </div>
                  )}

                  {project.clientType && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-accent mr-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-0.5">Client Type</p>
                        <p className="text-gray-900 font-semibold">{project.clientType}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.date && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-accent mr-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-0.5">Completion Date</p>
                        <p className="text-gray-900 font-semibold">{project.date}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.category && (
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 text-accent mr-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-0.5">Category</p>
                        <p className="text-gray-900 font-semibold">{project.category}</p>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-accent mr-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-0.5">Location</p>
                        <p className="text-gray-900 font-semibold">{project.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-6 font-heading border-b border-primary/20 pb-4">Technologies Used</h3>
                  <ul className="space-y-4">
                    {project.technologies.map((tech: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-accent mr-3 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 font-heading text-center">Project Gallery</h2>
          {project.gallery.length >= 5 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[600px]">
              <div className="md:col-span-2 md:row-span-2 h-full">
                <img src={project.gallery[0]} alt="Gallery 1" className="w-full h-full object-cover rounded-xl shadow-md min-h-[300px]" />
              </div>
              <div className="md:col-span-1 md:row-span-1 h-full">
                <img src={project.gallery[1]} alt="Gallery 2" className="w-full h-full object-cover rounded-xl shadow-md min-h-[200px]" />
              </div>
              <div className="md:col-span-1 md:row-span-1 h-full">
                <img src={project.gallery[2]} alt="Gallery 3" className="w-full h-full object-cover rounded-xl shadow-md min-h-[200px]" />
              </div>
              <div className="md:col-span-1 md:row-span-1 h-full">
                <img src={project.gallery[3]} alt="Gallery 4" className="w-full h-full object-cover rounded-xl shadow-md min-h-[200px]" />
              </div>
              <div className="md:col-span-1 md:row-span-1 h-full">
                <img src={project.gallery[4]} alt="Gallery 5" className="w-full h-full object-cover rounded-xl shadow-md min-h-[200px]" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.gallery.map((img: string, idx: number) => (
                <div key={idx} className={`${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''} h-full`}>
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded-xl shadow-md min-h-[250px]" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA / Next Project Section */}
      <div className="bg-gray-900 py-20 text-center relative overflow-hidden">
        {/* Abstract background design */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl translate-x-[-20%] translate-y-[-20%]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl translate-x-[20%] translate-y-[20%]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can bring our expertise to your upcoming initiative and achieve outstanding results together.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-accent hover:bg-accent/90 rounded-full transition-all shadow-lg hover:shadow-accent/30 transform hover:-translate-y-1"
          >
            Request a Quote
          </Link>
          
          {nextProject && (
            <div className="mt-20 pt-12 border-t border-gray-800">
              <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm font-semibold">Up Next</p>
              <Link 
                href={`/project/${slugify(nextProject.title)}`}
                className="group inline-flex items-center text-3xl font-bold text-white hover:text-accent transition-colors"
              >
                {nextProject.title}
                <ChevronRight className="ml-3 h-8 w-8 group-hover:translate-x-2 transition-transform text-accent" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

