import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import { projects } from '@/lib/projects';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      {/* Hero Image Section */}
      <div className="w-full h-[40vh] md:h-[60vh] relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-heading shadow-sm">
              {project.title}
            </h1>
            <span className="inline-block bg-accent text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              {project.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          
          <div className="mb-8">
            <Link href="/projects" className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading border-b pb-4">Project Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                  {project.fullDescription}
                </p>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-heading">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-accent mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Client</p>
                      <p className="text-gray-900 font-medium">{project.client}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-accent mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Completion Date</p>
                      <p className="text-gray-900 font-medium">{project.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-accent mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Category</p>
                      <p className="text-gray-900 font-medium">{project.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-4 font-heading">Technologies Used</h3>
                <ul className="space-y-3">
                  {project.technologies.map((tech, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
