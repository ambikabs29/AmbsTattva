
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="space-y-12">
        <div className="text-center">
          <img 
            src="https://picsum.photos/seed/ambs/300/300" 
            alt="Profile" 
            className="w-48 h-48 rounded-full mx-auto mb-8 border-4 border-white shadow-xl"
          />
          <h1 className="text-4xl font-bold text-slate-900 serif">I am Ambs</h1>
          <p className="text-indigo-600 font-bold tracking-widest uppercase text-sm mt-2">Creator • Developer • Educator</p>
        </div>

        <div className="prose prose-lg text-slate-600 leading-relaxed max-w-none">
          <p>
            Welcome to Ambs Tattva. My journey began at the intersection of traditional crafts and cutting-edge 
            technology. I believe that professional excellence isn't just about what you do, but the spirit 
            you bring to it.
          </p>
          <p>
            Whether I am stitching a silk scarf, teaching a complex mathematical concept, or architecting 
            a cloud-native SaaS application, the goal remains the same: <strong>Purity of Purpose</strong>.
          </p>
          <div className="bg-indigo-50 p-8 rounded-2xl my-12 border-l-4 border-indigo-600 italic">
            "We are all composed of elements (Tattvas). My work is simply an expression of these elements 
            synchronized with modern utility."
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Promise</h2>
          <p>
            When you purchase from my store, join my classes, or subscribe to my software, you are 
            interacting directly with me. There are no layers, no call centers, and no impersonal 
            third-party algorithms. Just high-quality, human-led service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">10+</div>
            <div className="text-sm font-bold uppercase tracking-tighter text-slate-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">500+</div>
            <div className="text-sm font-bold uppercase tracking-tighter text-slate-400">Students Taught</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">15+</div>
            <div className="text-sm font-bold uppercase tracking-tighter text-slate-400">Apps Launched</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
