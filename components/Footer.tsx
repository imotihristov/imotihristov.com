import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8fcf9] border-t border-[#e7f3eb] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="text-primary">
                 <span className="material-symbols-outlined text-3xl">real_estate_agent</span>
              </div>
              <h3 className="text-text-main text-lg font-bold">Имоти Христов</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Вашият доверен партньор в света на недвижимите имоти. Професионализъм и коректност от 2010 г.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">public</span></a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">alternate_email</span></a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">rss_feed</span></a>
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
                <span>+359 888 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">mail</span>
                <span>office@imotihristov.bg</span>
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