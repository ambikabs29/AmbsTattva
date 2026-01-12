
import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Handmade Store',
      description: 'Exquisite homemade products from ceramics to organic oils.',
      icon: '🛍️',
      page: Page.Store,
      color: 'bg-rose-50 border-rose-100'
    },
    {
      title: 'Online Tuition',
      description: 'Personalized learning with Google Class & Meet integration.',
      icon: '🎓',
      page: Page.Tuition,
      color: 'bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Masterclass Courses',
      description: 'Self-paced learning modules for high-impact skills.',
      icon: '📽️',
      page: Page.Courses,
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'SaaS Platform',
      description: 'Powerful web & app solutions for modern challenges.',
      icon: '💻',
      page: Page.SaaS,
      color: 'bg-sky-50 border-sky-100'
    },
    {
      title: 'Personal Blog',
      description: 'Reflections on technology, art, and life.',
      icon: '✍️',
      page: Page.Blog,
      color: 'bg-amber-50 border-amber-100'
    },
    {
      title: 'My Portfolio',
      description: 'A gallery of my architectural and digital creations.',
      icon: '🎨',
      page: Page.Portfolio,
      color: 'bg-purple-50 border-purple-100'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/abstract/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Ambs Tattva
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 serif italic">
            "Artisanal Spirit. Technological Soul. Unified Excellence."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate(Page.Store)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all transform hover:scale-105"
            >
              Explore Store
            </button>
            <button 
              onClick={() => onNavigate(Page.About)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/30 transition-all"
            >
              My Story
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A Holistic Ecosystem</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From physical crafts to digital intelligence, I offer a range of boutique services 
            designed with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div 
              key={section.page}
              onClick={() => onNavigate(section.page)}
              className={`p-8 rounded-2xl border ${section.color} cursor-pointer hover:shadow-xl transition-all group`}
            >
              <div className="text-4xl mb-6">{section.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-slate-600 mb-6">{section.description}</p>
              <div className="flex items-center text-indigo-600 font-bold text-sm">
                Learn More 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="bg-indigo-900 py-20 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6 serif">Why Tattva?</h2>
            <p className="text-lg text-indigo-100 leading-relaxed mb-6">
              "Tattva" represents the elements of reality. In my professional world, this translates to 
              authenticity in every product, rigor in every lesson, and innovation in every line of code.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">✓</span>
                Direct interaction with the creator
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">✓</span>
                No third-party vendors or middlemen
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">✓</span>
                Bespoke quality at scale
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://picsum.photos/seed/creator/600/400" 
              alt="Creator working" 
              className="rounded-2xl shadow-2xl rotate-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
