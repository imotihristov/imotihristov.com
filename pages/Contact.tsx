import React from 'react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
    <div className="bg-background-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Breadcrumb & Heading */}
         <div className="flex flex-col gap-4 mb-12">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
               <Link to="/" className="hover:text-primary hover:underline">Начало</Link>
               <span className="material-symbols-outlined text-base">chevron_right</span>
               <span className="text-text-main font-medium">Контакти</span>
            </div>
            <div>
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-main mb-3">Свържете се с нас</h2>
               <p className="text-lg text-text-secondary max-w-2xl">Нашият екип е на разположение за вашите въпроси и консултации. Изпратете ни съобщение или ни посетете на място.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-10">
               <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-text-main border-l-4 border-primary pl-3">Нашите координати</h3>
                  <div className="grid gap-4">
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">location_on</span></div>
                        <div><h4 className="font-bold text-text-main">Адрес</h4><p className="text-text-secondary text-sm mt-1">Шумен, България</p></div>
                     </div>
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">call</span></div>
                        <div><h4 className="font-bold text-text-main">Телефон</h4><p className="text-text-secondary text-sm mt-1"><a href="tel:+359888123456" className="hover:text-primary">+359 888 123 456</a><br/><a href="tel:+35929876543" className="hover:text-primary">+359 2 987 6543</a></p></div>
                     </div>
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">mail</span></div>
                        <div><h4 className="font-bold text-text-main">Имейл</h4><p className="text-text-secondary text-sm mt-1"><a href="mailto:office@imotihristov.bg" className="hover:text-primary">office@imotihristov.bg</a><br/><a href="mailto:sales@imotihristov.bg" className="hover:text-primary">sales@imotihristov.bg</a></p></div>
                     </div>
                  </div>
               </div>
               
               <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-text-main border-l-4 border-primary pl-3">Работно време</h3>
                  <div className="bg-white rounded-xl border border-[#e7f3eb] overflow-hidden">
                     <div className="grid grid-cols-2 p-4 border-b border-[#e7f3eb] hover:bg-gray-50 transition-colors">
                        <span className="text-text-secondary font-medium text-sm">Понеделник - Петък</span>
                        <span className="text-text-main font-bold text-right text-sm">09:00 - 18:00</span>
                     </div>
                     <div className="grid grid-cols-2 p-4 hover:bg-gray-50 transition-colors">
                        <span className="text-text-secondary font-medium text-sm">Събота - Неделя</span>
                        <span className="text-primary font-bold text-right text-sm">Почивен ден</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-4 pt-2">
                  <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.123 4.13c.636-.247 1.363-.416 2.427-.465C7.22 3.63 7.557 3.62 9.775 3.62h2.54z" clipRule="evenodd"></path></svg>
                  </a>
               </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
               <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#e7f3eb] shadow-xl shadow-gray-200/50 h-full">
                  <div className="flex flex-col gap-6">
                     <div>
                        <h3 className="text-2xl font-bold text-text-main">Изпратете запитване</h3>
                        <p className="text-text-secondary text-sm mt-2">Попълнете формата и ние ще се свържем с вас в рамките на работния ден.</p>
                     </div>
                     <form className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div className="flex flex-col gap-2">
                              <label htmlFor="name" className="text-sm font-bold text-text-main">Вашето име <span className="text-primary">*</span></label>
                              <input id="name" type="text" placeholder="Иван Иванов" className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" />
                           </div>
                           <div className="flex flex-col gap-2">
                              <label htmlFor="phone" className="text-sm font-bold text-text-main">Телефон <span className="text-primary">*</span></label>
                              <input id="phone" type="tel" placeholder="+359 888 ..." className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" />
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="email" className="text-sm font-bold text-text-main">Имейл адрес <span className="text-primary">*</span></label>
                           <input id="email" type="email" placeholder="ivan@example.com" className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="subject" className="text-sm font-bold text-text-main">Относно</label>
                           <select id="subject" className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                              <option value="general">Общо запитване</option>
                              <option value="buy">Покупка на имот</option>
                              <option value="sell">Продажба на имот</option>
                              <option value="rent">Наем</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="message" className="text-sm font-bold text-text-main">Съобщение <span className="text-primary">*</span></label>
                           <textarea id="message" rows={5} placeholder="Здравейте, интересувам се от..." className="w-full p-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-gray-400"></textarea>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <input type="checkbox" id="gdpr" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary" />
                           <label htmlFor="gdpr" className="text-xs text-text-secondary">Съгласен съм с обработката на личните ми данни.</label>
                        </div>
                        <button type="submit" className="w-full h-14 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                           <span>Изпрати запитване</span>
                           <span className="material-symbols-outlined">send</span>
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      {/* Map */}
      <div className="w-full h-[400px] sm:h-[500px] bg-gray-200 border-t border-[#e7f3eb]">
         <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src="https://maps.google.com/maps?q=Shumen%2C%20Bulgaria&t=&z=14&ie=UTF8&iwloc=&output=embed"
            title="Location Map"
            className="grayscale hover:grayscale-0 transition-all duration-700"
         ></iframe>
      </div>
    </div>
  );
};

export default Contact;