
import React from 'react';

const TuitionPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Personalized Online Tuition</h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            I offer one-on-one and small group coaching sessions across STEM subjects and computer science. 
            All classes are integrated with <strong>Google Classroom</strong> for assignments and 
            <strong>Google Meet</strong> for high-definition face-to-face sessions.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-indigo-50 rounded-xl">
              <h3 className="font-bold text-indigo-700">Google Meet</h3>
              <p className="text-xs text-indigo-600">Live Interactive Sessions</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <h3 className="font-bold text-emerald-700">Classroom</h3>
              <p className="text-xs text-emerald-600">Assignment Management</p>
            </div>
          </div>
          <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200">
            Book a Demo Session
          </button>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/learning/800/600" 
              alt="Online learning" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm">Next Session Starting In...</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">14m : 22s</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-8 text-center">My Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔢</div>
            <h3 className="font-bold mb-2">Advanced Mathematics</h3>
            <p className="text-sm text-slate-500">Calculus, Linear Algebra, and Statistics for all levels.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💻</div>
            <h3 className="font-bold mb-2">Computer Science</h3>
            <p className="text-sm text-slate-500">Python, Data Structures, and Modern Web Development.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔬</div>
            <h3 className="font-bold mb-2">Physics & Logic</h3>
            <p className="text-sm text-slate-500">Theoretical physics foundations and logical reasoning.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TuitionPage;
