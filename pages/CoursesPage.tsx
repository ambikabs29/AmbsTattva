
import React from 'react';
import { getCurrencyConfig, formatPrice } from '../utils/currency';

const CoursesPage: React.FC = () => {
  const currency = getCurrencyConfig();
  const courses = [
    { title: 'The Tattva of UI Design', modules: 12, students: 1420, price: 49, img: 'https://picsum.photos/seed/ui/400/250' },
    { title: 'Fullstack React Mastery', modules: 24, students: 890, price: 129, img: 'https://picsum.photos/seed/code/400/250' },
    { title: 'Artisanal Business Strategy', modules: 8, students: 450, price: 79, img: 'https://picsum.photos/seed/biz/400/250' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Course Academy</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">Master new skills with structured, self-paced video courses created entirely by me.</p>
        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Prices displayed in {currency.code}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <img src={c.img} alt={c.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{c.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span>📚 {c.modules} Modules</span>
                <span>👥 {c.students} Students</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(c.price, currency)}</span>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
