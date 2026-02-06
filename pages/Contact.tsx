import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const subjectMap: Record<string, string> = {
    'general': 'Общо запитване',
    'buy': 'Покупка на имот',
    'sell': 'Продажба на имот',
    'rent': 'Наем'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(formRef.current);
      const subjectValue = formData.get('subject') as string;
      
      const { data, error } = await supabase.functions.invoke('send-inquiry', {
        body: {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          subject: subjectMap[subjectValue] || subjectValue,
          type: 'contact'
        }
      });

      if (error) throw error;
      
      setIsSuccess(true);
      
      // Reset form and button after 3 seconds
      setTimeout(() => {
        formRef.current?.reset();
        setIsSuccess(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (error: any) {
      console.error('Form submission error:', error);
      console.error('Error details:', error?.message, error?.context);
      const errorMsg = error?.context?.body?.error || error?.message || 'Неизвестна грешка';
      alert(`Грешка при изпращане: ${errorMsg}`);
      setIsSubmitting(false);
    }
  };

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
               <p className="text-lg text-text-secondary max-w-5xl">Нашият екип е на разположение за вашите въпроси и консултации. Изпратете ни съобщение или ни посетете на място.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-16">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
               <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-bold text-text-main border-l-4 border-primary pl-3">Нашите координати</h3>
                  <div className="grid gap-4">
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">location_on</span></div>
                        <div><h4 className="font-bold text-text-main">Адрес</h4><p className="text-text-secondary text-sm mt-1">Шумен, България</p></div>
                     </div>
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">call</span></div>
                        <div><h4 className="font-bold text-text-main">Телефон</h4><p className="text-text-secondary text-sm mt-1"><a href="tel:++359898910259" className="hover:text-primary">+359898910259</a></p></div>
                     </div>
                     <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined filled">mail</span></div>
                        <div><h4 className="font-bold text-text-main">Имейл</h4><p className="text-text-secondary text-sm mt-1"><a href="mailto:imotihristov@gmail.com" className="hover:text-primary">imotihristov@gmail.com</a></p></div>
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
                  <a href="https://www.facebook.com/imothristov" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-[#0866ff] hover:text-white hover:border-[#0866ff] transition-all duration-300 shadow-sm" title="Facebook" aria-label="Facebook">
                     <img src="/facebook.svg" alt="" className="w-8 h-8" />
                  </a>
                  <a href="viber://contact?number=%2B359898910259" className="w-10 h-10 rounded-full bg-white border border-[#e7f3eb] flex items-center justify-center text-text-main hover:bg-[#7360f2] hover:text-white hover:border-[#7360f2] transition-all duration-300 shadow-sm" title="Viber" aria-label="Viber">
                     <img src="/viber.svg" alt="" className="w-8 h-8" />
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

                     <form 
                        ref={formRef}
                        className="flex flex-col gap-5" 
                        onSubmit={handleSubmit}
                     >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div className="flex flex-col gap-2">
                              <label htmlFor="name" className="text-sm font-bold text-text-main">Вашето име <span className="text-primary">*</span></label>
                              <input 
                                id="name" 
                                name="name"
                                type="text" 
                                placeholder="Иван Иванов" 
                                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" 
                                required
                              />
                           </div>
                           <div className="flex flex-col gap-2">
                              <label htmlFor="phone" className="text-sm font-bold text-text-main">Телефон <span className="text-primary">*</span></label>
                              <input 
                                id="phone" 
                                name="phone"
                                type="tel" 
                                placeholder="+359 888 ..." 
                                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" 
                                required
                              />
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="email" className="text-sm font-bold text-text-main">Имейл адрес <span className="text-primary">*</span></label>
                           <input 
                             id="email" 
                             name="email"
                             type="email" 
                             placeholder="ivan@example.com" 
                             className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400" 
                             required
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="subject" className="text-sm font-bold text-text-main">Относно</label>
                           <select 
                             id="subject" 
                             name="subject"
                             className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                           >
                              <option value="general">Общо запитване</option>
                              <option value="buy">Покупка на имот</option>
                              <option value="sell">Продажба на имот</option>
                              <option value="rent">Наем</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label htmlFor="message" className="text-sm font-bold text-text-main">Съобщение <span className="text-primary">*</span></label>
                           <textarea 
                             id="message" 
                             name="message"
                             rows={5} 
                             placeholder="Здравейте, интересувам се от..." 
                             className="w-full p-4 rounded-lg border border-gray-200 bg-white text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-gray-400"
                             required
                           ></textarea>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <input 
                             type="checkbox" 
                             id="gdpr" 
                             name="gdpr"
                             className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary" 
                             required
                           />
                           <label htmlFor="gdpr" className="text-xs text-text-secondary">Съгласен съм с обработката на личните ми данни. <span className="text-primary">*</span></label>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSubmitting || isSuccess}
                          className={`w-full h-14 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                            isSuccess 
                              ? 'bg-green-500 cursor-default' 
                              : 'bg-primary hover:bg-primary-hover shadow-primary/30 hover:scale-[1.01] active:scale-[0.99]'
                          } ${(isSubmitting || isSuccess) ? 'cursor-not-allowed' : ''}`}
                        >
                           {isSuccess ? (
                             <>
                               <span>Изпратено</span>
                               <span className="material-symbols-outlined">check_circle</span>
                             </>
                           ) : isSubmitting ? (
                             <>
                               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                               <span>Изпращане...</span>
                             </>
                           ) : (
                             <>
                               <span>Изпрати запитване</span>
                               <span className="material-symbols-outlined">send</span>
                             </>
                           )}
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
