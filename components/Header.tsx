import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      // In a real app, this would route to details or filter
      navigate(`/properties?id=${searchId}`);
      setSearchId('');
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
      
    return `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-text-main hover:text-primary'
    }`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
      
    return `font-medium ${
      isActive ? 'text-primary' : 'text-text-main'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7f3eb] bg-[#f8fcf9]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">real_estate_agent</span>
          </div>
          <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">Имоти Христов</h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
          <Link to="/" className={getLinkClass('/')}>Начало</Link>
          <Link to="/properties" className={getLinkClass('/properties')}>Имоти</Link>
          <Link to="/services" className={getLinkClass('/services')}>Услуги</Link>
          <Link to="/about" className={getLinkClass('/about')}>За нас</Link>
          <Link to="/contact" className={getLinkClass('/contact')}>Контакти</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
           {/* Search by ID Input */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-white border border-[#e7f3eb] rounded-lg px-3 h-10 w-48 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-sm">
            <span className="material-symbols-outlined text-text-secondary text-[20px] leading-none flex items-center">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-text-main placeholder:text-text-secondary/70 p-0 pl-2 h-full" 
              placeholder="Търсене по ID..." 
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </form>

          {/* Admin Button (Subtle) - Hidden on mobile */}
          {/* Link to /login instead of /admin so that non-logged in users can access the login page */}
          <Link to="/login" title="Вход за администратори" className={`hidden md:block p-2 rounded-full transition-colors ${location.pathname.startsWith('/admin') ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/10'}`}>
             <span className="material-symbols-outlined">admin_panel_settings</span>
          </Link>

          {/* CTA Button */}
          <Link to="/contact" className="hidden md:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-[#ffffff] text-sm font-bold shadow-sm hover:bg-primary-hover transition-all">
            Свържете се с нас
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-text-main"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#e7f3eb] bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>Начало</Link>
            <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/properties')}>Имоти</Link>
            <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/services')}>Услуги</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/about')}>За нас</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/contact')}>Контакти</Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/admin')}>Администрация</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;