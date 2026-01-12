
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import StorePage from './pages/StorePage';
import TuitionPage from './pages/TuitionPage';
import CoursesPage from './pages/CoursesPage';
import SaaSPage from './pages/SaaSPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <HomePage onNavigate={setCurrentPage} />;
      case Page.About: return <AboutPage />;
      case Page.Portfolio: return <PortfolioPage />;
      case Page.Blog: return <BlogPage />;
      case Page.Store: return <StorePage />;
      case Page.Tuition: return <TuitionPage />;
      case Page.Courses: return <CoursesPage />;
      case Page.SaaS: return <SaaSPage />;
      case Page.Admin: return <AdminPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
