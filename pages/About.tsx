import React from 'react';
import { Link } from 'react-router-dom';
import { TeamMember, Testimonial } from '../types';

const team: TeamMember[] = [
  { id: 1, name: "Иван Христов", role: "Управител", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEPRV_gpTHr6lEV2oiOr1dbGrG8lyDpgYx__J7OsfkUDNmlSY6w02dFSpfQ6zXRk4Z3mfoWVsHiyttA2aPuwZz0DBtMZnCfy-awcLtIWt-QC607iTWvdCsQo8878g9Z-YATiuFOpORyq9M6itmtWJTAtkDSMBjXf4szv7TqRjx7f__2JZSyd5hMA385GgcZlGCcQG5LrdUPY0FFzc3XOn6ElbnUNG7opF57uMp_ouOaULBMU-oFlrliEuYvTPS7BwNWI2_vec9u-g" },
  { id: 2, name: "Мария Петрова", role: "Старши Брокер", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Aa4UYur7AVUi8FL2A9QYMzhTnVp1vO78A7gAdrRxV9YvmXl1WEf_1eBDdSdQRkUxjPYULE-FF6xGCPHhd_cANI6muK86KgbVvaz6kf5smPCvHg-Y2tBuOUDtoLZnVgksANth6sAI7McdtfWKVSRnm3hdzQvbvHkjl9DeSxhKcA2LkZzTs_nAHUsIz5PwniMLqe65BvLykyl-Opr-FZnhiGw-VxrasY5S3OKLkrYNGbAVedy5fQb9W-AXzzBxnc-qIOx7KiEMRvE" },
  { id: 3, name: "Георги Иванов", role: "Брокер", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjGEGbRnetogiiTaRl-dAsZryk48ms_fn3oYpfv_7pu-SVp1gRzWW4Shn3YJS7QFmfzugGCc_43OWpMRYqQSBXhjXPZZ0mievS6M67sm-1_TJxjg0TvvX4sKB-UyP4nIfb8q4VdxWfqzDk7QjBHq6Yn_sLENvTYM-hReGt8RaSlyeR4S1lbkLKtMFRZHkV5Iuf7mPDqRZYQR8X_b-EGkwM4B-EIMtuNwUHduNhqWSoLmTRMb1PAO2XnfI4OY74ewnJJbDfr098duY" },
  { id: 4, name: "Елена Димитрова", role: "Юрисконсулт", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9KV-RgdWisT0OPe9w3R1whfBLnfdBJBWwc790PT7S2nxDVwhQwH6QJl-u2ESnujyMwUU_sK5WHjGey1U2RzXWE6xAe7c5OKpQms1sTPMoY7Ws3s5AYNTS2XKVzcJEETb2dY_fGY1BVDlpvnXFhE98VvR53KxFHqmKuu64ZP37V3biYXj8sbcMHXYZuldnWA9TPBmuqbhMs71po4xrY9SZDJQ4o73R8Td07sWI4grRuLvERrz7Vx23oyExfKwho_XDY3xukn1Jk6A" }
];

const testimonials: Testimonial[] = [
  { id: 1, text: "Изключително професионално отношение! Екипът на Имоти Христов направи продажбата на апартамента ни лесна и бърза.", author: "Петър Тодоров", location: "Шумен", rating: 5, image: "https://ik.imagekit.io/khvvoa8bvd/daweid-icon-7797704_1920.png" },
  { id: 2, text: "Благодарение на Мария намерихме перфектния дом за нашето семейство. Препоръчвам горещо!", author: "Ани Георгиева", location: "Шумен", rating: 5, image: "https://ik.imagekit.io/khvvoa8bvd/daweid-icon-7797704_1920.png" },
  { id: 3, text: "Коректност и прозрачност. Много съм доволен от консултацията и съдействието при документите.", author: "Димитър Василев", location: "Шумен", rating: 4.5, image: "https://ik.imagekit.io/khvvoa8bvd/daweid-icon-7797704_1920.png" }
];

const About: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(13, 27, 18, 0.7), rgba(13, 27, 18, 0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHguoaSzDogs1tF42Dl-Sp2bl-CHV8bAU5dJH3jZUbGubCgK5L_chKQ_ksim4NHBYKiQSI0hmyxU1opNFdZZeC3DZSaFCT1EzRMruhV6px3VDyHV92YAJu6HOovACc279JafCsysi_qCM_jHfokepn1QgZtNVnMf0fT-FHwOhrXDpkgqC7gkG0Mp4PQESCYth0T0AwRskqUpeJdvhckZRmajjkgNNqJ-1u5EVoTGW0j_1rbEPFNTgPCwZIFxXCpizs_dDT2_p8-Qo")` }}>
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Повече от просто<br/>
              <span className="text-primary">агенция за имоти</span>
            </h1>
            <p className="text-white/90 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mb-8">
              Ние създаваме връзки между хора и домове. История за доверие, професионализъм и споделени мечти, която започва през 2018 година.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-[#ffffff] text-base font-bold hover:bg-primary/90 transition-colors">
                 Вижте нашите услуги
              </Link>
              <Link to="/contact" className="flex items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-medium hover:bg-white/20 transition-colors">
                Свържете се с нас
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24 bg-background-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Нашата История</span>
              </div>
              <h2 className="text-text-main text-3xl font-bold leading-tight sm:text-4xl">
                Изграждаме доверие тухла по тухла
              </h2>
              <div className="space-y-4 text-text-main/80 text-base leading-relaxed">
                <p>
                  Агенция "Имоти Христов" е създадена с ясната визия да промени стандарта в сектора на недвижимите имоти в България. Започнахме като малък семеен бизнес с идеята да предоставим честна и прозрачна услуга.
                </p>
                <p>
                  Днес, повече от десетилетие по-късно, ние сме горди, че сме помогнали на хиляди семейства да открият своя мечтан дом или да реализират успешна инвестиция. Ние вярваме, че всеки клиент заслужава лично отношение, компетентен съвет и сигурност във всяка стъпка от сделката.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4 pt-6 border-t border-[#e7f3eb]">
                <div>
                  <h3 className="text-4xl font-black text-primary mb-1">8+</h3>
                  <p className="text-sm font-medium text-text-main">Години опит</p>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-primary mb-1">Стотици</h3>
                  <p className="text-sm font-medium text-text-main">Успешни сделки</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img alt="Имоти Христов" className="w-full h-full object-cover p-10" src="/logo.png"/>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-10 bg-white p-4 rounded-xl shadow-lg max-w-[260px] hidden sm:block border border-[#e7f3eb]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl filled">verified</span>
                  <span className="font-bold text-text-main text-lg">Лицензиран брокер</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-10 bg-[#eef7f2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-text-main text-3xl font-bold mb-4">Нашите ценности</h2>
            <p className="text-text-main/70">
              Принципите, които ни водят във всяка сделка и всяко взаимодействие с нашите клиенти.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#cfe7d7] hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">handshake</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Коректност</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Държим на думата си и работим прозрачно. Всяка клауза и условие са ясни от самото начало, без скрити такси.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#cfe7d7] hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Професионализъм</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                 Нашият екип се състои от сертифицирани експерти, които постоянно надграждат знанията си за пазара.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#cfe7d7] hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Лично отношение</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Индивидуален подход към нуждите на всеки клиент. Ние не продаваме просто имоти, а намираме домове.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section 
      <section className="py-16 lg:py-24 bg-background-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-text-main text-3xl font-bold mb-2">Нашият Екип</h2>
              <p className="text-text-secondary">Хората, които правят разликата.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="group flex flex-col">
                <div className="relative overflow-hidden rounded-xl mb-4 aspect-[3/4]">
                  <img alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={member.image}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-2">
                       <button className="bg-white p-2 rounded-full text-text-main hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">mail</span></button>
                       <button className="bg-white p-2 rounded-full text-text-main hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">call</span></button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-text-main text-lg font-bold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Testimonials */}
      <section className="py-16 bg-white border-y border-[#e7f3eb]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-text-main text-3xl font-bold mb-4">Какво казват нашите клиенти</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="p-6 rounded-xl bg-background-light border border-[#cfe7d7]">
                 <div className="flex gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-sm ${i < Math.floor(item.rating) ? 'filled' : ''}`}>star</span>
                    ))}
                 </div>
                 <p className="text-text-main italic mb-6">"{item.text}"</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                     <img alt={item.author} className="w-full h-full object-cover" src={item.image}/>
                   </div>
                   <div>
                     <p className="text-sm font-bold text-text-main">{item.author}</p>
                     <p className="text-xs text-text-secondary">{item.location}</p>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-[#102216]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Готови ли сте да намерите своя нов дом?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Свържете се с нас за безплатна консултация. Нашият екип е на разположение да отговори на всички ваши въпроси.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-3 rounded-lg bg-primary text-[#ffffff] font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Свържете се с нас
            </Link>
            <Link to="/properties" className="px-8 py-3 rounded-lg bg-transparent border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-colors">
              Разгледайте оферти
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;