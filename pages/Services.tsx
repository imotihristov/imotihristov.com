import React from 'react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <div className="w-full">
      {/* Page Heading */}
      <section className="relative bg-background-light py-12 md:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-primary text-xs font-bold uppercase tracking-wide">Вашият доверен партньор</span>
            </div>
            <h1 className="text-text-main text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
               Нашите <span className="text-primary">Услуги</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
               Професионални решения за вашия имот от Имоти Христов. Ние се грижим за всеки детайл, за да бъде вашето изживяване спокойно и успешно.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text-main mb-4">Цялостно обслужване на едно място</h2>
            <p className="text-text-secondary max-w-2xl">Ние не просто продаваме имоти, ние създаваме дългосрочни партньорства чрез качество и доверие.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {icon: 'currency_exchange', title: 'Покупко-продажба', desc: 'Посредничество при покупка и продажба на жилищни и търговски имоти с пълна прозрачност. Осигуряваме най-добрата цена за вашия имот.'},
              {icon: 'key', title: 'Наеми', desc: 'Съдействие за наемодатели и наематели за намиране на перфектното съвпадение. Управление на договори и огледи.'},
              {icon: 'chat_bubble_outline', title: 'Консултации', desc: 'Експертни съвети относно пазарните тенденции и възможности за инвестиции. Индивидуален подход към всеки клиент.'},
              {icon: 'gavel', title: 'Правно обслужване', desc: 'Пълна правна подкрепа и изготвяне на всички необходими документи за сделката. Сигурност и защита на вашите интереси.'},
              {icon: 'trending_up', title: 'Оценки', desc: 'Професионална оценка на имоти и пазарен анализ за определяне на точната цена. Реалистични прогнози за възвръщаемост.'},
              {icon: 'apartment', title: 'Управление на имоти', desc: 'Цялостна грижа за вашия имот, включително поддръжка, ремонти и комуникация с наематели.'},
            ].map((service, idx) => (
              <div key={idx} className="group relative bg-background-light rounded-xl p-8 border border-[#e7f3eb] hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[32px]">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-6 flex-grow">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Clarity Section */}
      <section className="py-16 bg-[#f8fcf9] border-y border-[#e7f3eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-text-main mb-4">Прозрачни цени и условия</h2>
             <p className="text-text-secondary max-w-2xl mx-auto">
               Ние вярваме в честните отношения. Ето ясно описание на това какво получавате безплатно като наш клиент и какви са комисионните възнаграждения.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Free Service 1 */}
             <div className="bg-white p-6 rounded-xl border border-[#e7f3eb] shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="size-12 rounded-full bg-green-50 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined filled">chat</span>
                </div>
                <h3 className="font-bold text-lg text-text-main mb-2">Консултации</h3>
                <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Професионална консултация за покупка или продажба на имот. Подбор на подходящи имоти по критерии.
                </p>
                <div className="mt-auto px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                  БЕЗПЛАТНО
                </div>
             </div>

             {/* Free Service 2 */}
             <div className="bg-white p-6 rounded-xl border border-[#e7f3eb] shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="size-12 rounded-full bg-green-50 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined filled">directions_car</span>
                </div>
                <h3 className="font-bold text-lg text-text-main mb-2">Организация на огледи</h3>
                <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Не таксуваме за огледи. Включва и виртуални огледи по Skype, Viber или Messenger.
                </p>
                <div className="mt-auto px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                  БЕЗПЛАТНО
                </div>
             </div>

             {/* Free Service 3 */}
             <div className="bg-white p-6 rounded-xl border border-[#e7f3eb] shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="size-12 rounded-full bg-green-50 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined filled">photo_camera</span>
                </div>
                <h3 className="font-bold text-lg text-text-main mb-2">Заснемане и Реклама</h3>
                <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Професионално фото заснемане, видеоклип и реклама в нашите канали и социални мрежи.
                </p>
                <div className="mt-auto px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                  БЕЗПЛАТНО*
                </div>
             </div>

             {/* Free Service 4 */}
             <div className="bg-white p-6 rounded-xl border border-[#e7f3eb] shadow-sm flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <div className="size-12 rounded-full bg-green-50 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined filled">gavel</span>
                </div>
                <h3 className="font-bold text-lg text-text-main mb-2">Правно обслужване</h3>
                <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Изготвяне на документи, юридическа и данъчна консултация при сделка.
                </p>
                <div className="mt-auto px-4 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                  БЕЗПЛАТНО*
                </div>
             </div>

             {/* Paid Service 1 */}
             <div className="bg-[#0d1b12] p-6 rounded-xl border border-[#1a2f24] shadow-md flex flex-col items-center text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-8xl">handshake</span>
                </div>
                <div className="size-12 rounded-full bg-white/10 text-white flex items-center justify-center mb-4 z-10">
                  <span className="material-symbols-outlined filled">payments</span>
                </div>
                <h3 className="font-bold text-lg mb-2 z-10">Комисионна Продажба</h3>
                <p className="text-sm text-gray-300 mb-4 flex-grow z-10">
                  Дължима при подписване на предварителен договор. Ексклузивно представителство.
                </p>
                <div className="mt-auto z-10">
                   <span className="text-3xl font-black text-primary">3%</span>
                   <p className="text-xs text-gray-400">от цената (мин. 800€)</p>
                </div>
             </div>

             {/* Paid Service 2 */}
             <div className="bg-[#0d1b12] p-6 rounded-xl border border-[#1a2f24] shadow-md flex flex-col items-center text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <span className="material-symbols-outlined text-8xl">key</span>
                </div>
                <div className="size-12 rounded-full bg-white/10 text-white flex items-center justify-center mb-4 z-10">
                  <span className="material-symbols-outlined filled">real_estate_agent</span>
                </div>
                <h3 className="font-bold text-lg mb-2 z-10">Комисионна Наеми</h3>
                <p className="text-sm text-gray-300 mb-4 flex-grow z-10">
                  Еднократна такса при успешно намиране на наемател или имот под наем.
                </p>
                <div className="mt-auto z-10">
                   <span className="text-2xl font-black text-primary">50% - 100%</span>
                   <p className="text-xs text-gray-400">от месечния наем</p>
                </div>
             </div>
           </div>
           
           <div className="mt-8 text-center">
             <p className="text-xs text-text-secondary italic">
               * Услугите отбелязани със звездичка са безплатни за клиенти, сключили договор за посредничество с Имоти Христов.
             </p>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <img alt="Modern building" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxL1sbDvoRZAUV4pJ9Uy3TqVi3z_igw0dctvJernX2hlTKHKjYykxzqA1UH8f9h3Kgi9fIi6a4zIei8WsHJrLUCoBJXtvfdY5md57UZBk6w4D6QoH3bLizqWbV4oOXEg_ulJrHi3Oqg2GQ0bWdtknbt-l4Uf47h90GfnHs0AMqF5SMx9NMxmWtkQ5_03pivIxddTbA6gYT_lQqNERVy2fBJoeEw-Hu3hAXYEC9l1o8-Ddo97i7HYy9MvZpMkjKzlmmX3WV9xs5bxk"/>
            <div className="absolute inset-0 bg-[#102216]/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#102216] to-transparent opacity-90"></div>
         </div>
         <div className="relative z-10 max-w-[960px] mx-auto text-center">
            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-6">Готови ли сте да започнем?</h2>
            <p className="text-gray-200 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
               Свържете се с нас днес за безплатна консултация. Нека превърнем вашите планове за недвижими имоти в реалност.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/contact" className="flex items-center justify-center bg-primary hover:bg-green-500 text-white dark:text-[#0d1b12] text-base font-bold h-14 px-8 rounded-lg transition-colors duration-200 shadow-lg shadow-primary/30">Свържете се с нас</Link>
               <Link to="/properties" className="flex items-center justify-center bg-transparent border-2 border-white hover:bg-white/10 text-white text-base font-bold h-14 px-8 rounded-lg transition-colors duration-200">Разгледайте имоти</Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Services;