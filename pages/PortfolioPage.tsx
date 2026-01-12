
import React from 'react';
import { PROJECTS } from '../constants';

const PortfolioPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Work Portfolio</h1>
        <p className="text-slate-600">A curation of my most impactful digital and physical projects.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {PROJECTS.map(project => (
          <div key={project.id} className="group relative">
            <div className="relative h-[400px] overflow-hidden rounded-3xl bg-slate-100">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-300 text-sm">{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
