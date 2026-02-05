import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8fcf9] border-t border-[#e7f3eb] pt-10 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-6">
          <div>
            <div className="flex items-center">
              <Link to="/">
                <img src="/logo.png" alt="Имоти Христов" className="h-28 w-auto object-contain" />
              </Link>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Вашият доверен партньор в света на недвижимите имоти. Професионализъм и коректност от 2010 г.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/imothristov" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-[#0866ff] hover:text-white hover:border-[#0866ff] transition-all duration-300 shadow-sm" title="Facebook" aria-label="Facebook">
                <img src="/facebook.svg" alt="" className="w-8 h-8" />
              </a>
              <a href="viber://contact?number=%2B359898910259" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-[#7360f2] hover:text-white hover:border-[#7360f2] transition-all duration-300 shadow-sm" title="Viber" aria-label="Viber">
                <img src="/viber.svg" alt="" className="w-8 h-8" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-text-main font-bold mb-4">Бързи връзки</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/" className="hover:text-primary transition-colors">Начало</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">За нас</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Продажби</Link></li>
              <li><Link to="/properties" className="hover:text-primary transition-colors">Наеми</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Услуги</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text-main font-bold mb-4">Услуги</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/services" className="hover:text-primary transition-colors">Оценка на имот</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Правна консултация</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Управление на имоти</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Кредитиране</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text-main font-bold mb-4">Контакти</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
                <span>Шумен, България</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">call</span>
                <span>+359898910259</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">mail</span>
                <a href="mailto:imotihristov@gmail.com" className="hover:text-primary">imotihristov@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#e7f3eb] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary text-center md:text-left">
            © 2023 Агенция Имоти Христов. Всички права запазени.
          </p>
          <div className="flex gap-6 text-xs text-text-secondary">
            <Link to="#" className="hover:text-primary">Политика за поверителност</Link>
            <Link to="#" className="hover:text-primary">Общи условия</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;