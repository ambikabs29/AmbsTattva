
import React, { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: Page.Home },
    { label: 'About', page: Page.About },
    { label: 'Portfolio', page: Page.Portfolio },
    { label: 'Blog', page: Page.Blog },
    { label: 'My Store', page: Page.Store },
    { label: 'Tuition', page: Page.Tuition },
    { label: 'Courses', page: Page.Courses },
    { label: 'SaaS', page: Page.SaaS },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onClick={() => onNavigate(Page.Home)}
          >
            <span className="text-2xl font-bold text-indigo-700 serif">Ambs Tattva</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  currentPage === item.page ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate(Page.Admin)}
              className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-xs font-bold"
            >
              ADMIN
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.page ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate(Page.Admin);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-indigo-700 font-bold bg-indigo-50 rounded-md"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
