"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function HoneycombGallery({ projects }: { projects: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  if (!projects || projects.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 px-4 py-8">
        {projects.map((project, index) => {
          // Adjust margins for the honeycomb layout
          const isEvenRow = Math.floor(index / 3) % 2 === 0;
          const marginTop = index >= 3 ? '-mt-[10%]' : '';
          const marginLeft = !isEvenRow && index % 3 === 0 ? 'ml-[15%]' : '';

          return (
            <div
              key={project._id || index}
              className={`relative w-[45%] md:w-[28%] lg:w-[22%] aspect-[8/9] ${marginTop} ${marginLeft} animate-float`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div 
                className="w-full h-full overflow-hidden group cursor-pointer"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  transition: 'all 0.5s ease'
                }}
                onClick={() => setSelectedProject(project)}
              >
                <img 
                  src={project.imageUrl || "/placeholder.jpg"} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-300"></div>
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                  <h3 className="text-white font-bold text-lg md:text-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zoom in/out Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedProject(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 bg-white/10 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            <img 
              src={selectedProject.imageUrl} 
              alt={selectedProject.title}
              className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl mb-8"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">{selectedProject.title}</h2>
            {selectedProject.description && (
              <p className="text-white/80 text-lg max-w-2xl text-center mb-6 line-clamp-3">
                {selectedProject.description}
              </p>
            )}
            <Link 
              href={`/projects`}
              className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
