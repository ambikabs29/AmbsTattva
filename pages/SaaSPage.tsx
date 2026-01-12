
import React from 'react';
import { SAAS_PRODUCTS } from '../constants';
import { getCurrencyConfig, formatPrice } from '../utils/currency';

const SaaSPage: React.FC = () => {
  const currency = getCurrencyConfig();
  
  // Convert price string like "$19/mo" to number for conversion
  const parsePrice = (priceStr: string) => Number(priceStr.replace(/[^0-9]/g, ''));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">SaaS Hub</h1>
        <p className="text-slate-600">Premium software tools built for efficiency and growth.</p>
        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Regional Pricing: {currency.code}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {SAAS_PRODUCTS.map(product => (
          <div key={product.id} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z"/></svg>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h2>
            <p className="text-slate-600 mb-8 max-w-md">{product.description}</p>
            
            <div className="space-y-4 mb-10">
              {product.features.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <span className="text-indigo-600">✦</span>
                  <span className="text-slate-700 font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-bold text-slate-900">{formatPrice(parsePrice(product.price), currency)}</span>
              <span className="text-slate-500 mb-1">billed monthly</span>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Get Started for Free
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-slate-900 rounded-3xl text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          I build bespoke web and mobile applications tailored to your specific business needs. 
          Let's talk about your project.
        </p>
        <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors">
          Inquire Now
        </button>
      </div>
    </div>
  );
};

export default SaaSPage;
