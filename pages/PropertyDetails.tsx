import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty, properties, brokers } = useProperties();
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when navigating between properties
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const property = getProperty(Number(id));

  // Determine broker: Use assigned broker or fallback to the first one in list
  const broker = property && property.brokerId 
    ? brokers.find(b => b.id === property.brokerId) 
    : brokers[0];

  // Fallback if no broker found at all (shouldn't happen with initial data)
  const displayBroker = broker || {
    name: "Имоти Христов",
    role: "Офис",
    phone: "+359 888 123 456",
    email: "office@imotihristov.bg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPDTZkdIjjqYR-e4e3yrro5-1TbNsbPK92U0GY2Yk9oVy1UpzeCaS63JJYXophPw6pdpofi2XlyAby_6VMIXG8t1myKUTgBWdMy3QzmpB65J2WslTUTgbSa5iINob1VrkLSNLiEGBsoG-YvdKNs3VP08E_Jz9vxHXBIySQMQIN_kfs9raTizpIDGTQrjZbQgm_yddVJIqRjDJ-rXcqWMBxinB5tHiqMsr7TjyEN0Nd8LDPKvrUznZraWOnGuZpfQL8oyE9W62sGDQ"
  };

  // Determine slides: Use gallery images if available, otherwise fallback to main image
  const slides = property 
    ? (property.images && property.images.length > 0 ? property.images : [property.image])
    : [];

  // Logic for Similar Properties
  const similarProperties = properties
    .filter(p => 
      p.id !== Number(id) && 
      p.status === 'active' &&
      p.category === property?.category && 
      p.type === property?.type
    )
    .slice(0, 4);

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset'; // Unlock scroll
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + slides.length - 1) % slides.length);
  }, [slides.length]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, nextImage, prevImage]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light">
        <h2 className="text-2xl font-bold text-gray-700">Имотът не е намерен</h2>
        <Link to="/properties" className="mt-4 text-primary hover:underline">Към всички имоти</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background-light py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[#4c9a66] mb-6">
          <Link to="/" className="hover:underline hover:text-primary">Начало</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/properties" className="hover:underline hover:text-primary">Имоти</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="hover:underline hover:text-primary cursor-pointer">{property.city}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#0d1b12] font-medium truncate max-w-[200px] sm:max-w-none">{property.title}</span>
        </nav>

        {/* Gallery Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-auto md:h-[500px] rounded-xl overflow-hidden relative group">
          {/* Main Large Image */}
          <div 
            className="md:col-span-3 h-[300px] md:h-full relative cursor-pointer overflow-hidden bg-gray-100"
            onClick={() => openLightbox(0)}
          >
            {property.image ? (
              <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${property.image}")` }}></div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Няма снимка</div>
            )}
            {property.isNew && <div className="absolute top-4 left-4 bg-primary text-[#0d1b12] text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm z-10">Нов</div>}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none"></div>
          </div>
          
          {/* Side Images (Visual Placeholders that open the lightbox) */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            {/* Top Side Image */}
            <div 
              className="flex-1 relative cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => openLightbox(slides.length > 1 ? 1 : 0)}
            >
               {property.image && <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${slides[1] || property.image}")`, filter: slides.length > 1 ? 'none' : 'brightness(0.9)' }}></div>}
            </div>
            
            {/* Bottom Side Image with "See All" overlay */}
            <div 
              className="flex-1 relative cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => openLightbox(0)}
            >
               {property.image && <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${slides[2] || property.image}")`, filter: slides.length > 2 ? 'none' : 'brightness(0.8)' }}></div>}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/50">
                 <button className="flex items-center gap-2 text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/50 transition-all pointer-events-none">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span>Виж всички</span>
                 </button>
               </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              onClick={closeLightbox}
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {/* Navigation Arrows (Only if multiple images) */}
            {slides.length > 1 && (
              <>
                <button 
                  className="absolute left-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  onClick={prevImage}
                >
                  <span className="material-symbols-outlined text-3xl">chevron_left</span>
                </button>
                <button 
                  className="absolute right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  onClick={nextImage}
                >
                  <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
              </>
            )}

            {/* Main Image */}
            <div 
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={slides[currentImageIndex]} 
                alt={`${property.title} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              />
              <div className="mt-4 text-white/80 font-medium text-sm">
                 {currentImageIndex + 1} / {slides.length}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Main Content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* Main Info Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               {/* Title */}
               <h1 className="text-2xl md:text-3xl font-black text-[#0d1b12] mb-3 leading-tight">
                 {property.title}
               </h1>

               {/* Location */}
               <div className="flex items-center gap-2 text-text-secondary mb-8">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  <span className="font-medium text-base">{property.location}</span>
               </div>

               {/* Price Block */}
               <div className="mb-8">
                  <div className="text-4xl font-black text-primary tracking-tight">
                     {property.currency === '€' ? `€${property.price.toLocaleString()}` : property.price}
                  </div>
                  {property.type === 'sale' && (
                     <div className="text-gray-400 font-medium mt-1 text-sm">
                        €{(Math.round(property.price / property.area)).toLocaleString()} / кв.м
                     </div>
                  )}
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
                  {/* Area */}
                  <div className="flex items-center gap-3">
                     <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined filled">square_foot</span>
                     </div>
                     <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Площ</p>
                        <p className="font-bold text-[#0d1b12] text-lg leading-none">{property.area} кв.м</p>
                     </div>
                  </div>

                  {/* Bedrooms */}
                  {property.beds !== undefined && property.beds > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">bed</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Спални</p>
                           <p className="font-bold text-[#0d1b12] text-lg leading-none">{property.beds}</p>
                        </div>
                    </div>
                  )}

                  {/* Floor */}
                  {property.floor && (
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">layers</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Етаж</p>
                           <p className="font-bold text-[#0d1b12] text-lg leading-none">{property.floor}</p>
                        </div>
                    </div>
                  )}

                  {/* Construction */}
                  {property.constructionType && (
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">domain</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Строителство</p>
                           <p className="font-bold text-[#0d1b12] text-lg leading-none">{property.constructionType}</p>
                        </div>
                    </div>
                  )}

                  {/* Fallback for Land/Commercial if minimal stats */}
                  {!property.beds && !property.floor && !property.constructionType && property.rooms && (
                     <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">meeting_room</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Помещения</p>
                           <p className="font-bold text-[#0d1b12] text-lg leading-none">{property.rooms}</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               <h3 className="text-xl font-bold text-[#0d1b12] mb-4">Описание на имота</h3>
               <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  <p>{property.description}</p>
               </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               <h3 className="text-xl font-bold text-[#0d1b12] mb-6">Удобства и особености</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  {property.features.map(am => (
                    <div key={am} className="flex items-center gap-3 group">
                       <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform filled">check_circle</span>
                       <span className="text-gray-700 font-medium">{am}</span>
                    </div>
                  ))}
                  {property.features.length === 0 && <p className="text-gray-500 italic">Няма въведени специфични удобства за този имот.</p>}
               </div>
            </div>

            {/* Map */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
              <h3 className="text-xl font-bold text-[#0d1b12] mb-4">Локация</h3>
              <div className="relative w-full h-[350px] rounded-xl overflow-hidden group border border-gray-100">
                 <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3TsWqOv92rg-joFnldtYqbcStwL4wF0EnLhTtzbjSorzsj_yRrqNKYowdqz26XeLqRvHJWJ0CVMmcv90cKiN8SyzT5krkc5UwlUsdajswvUvH880jTb38Na038Yv6Gadhba4TxH2pn1QiIX7OfsWaxTxNrUS8hykMe_wqaAiazbbZOpKUqXoEiYCMXKpFKSbMnzKtBXcdFt4ZRqtbaK-j_yZexM40Y5XUfqA9Yo30e2rRgEUtkyM1vVB1NafC1Vrt5FRW1EgTeBk")` }}></div>
                 <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <button className="bg-white text-[#0d1b12] px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform hover:bg-primary hover:text-white">
                       <span className="material-symbols-outlined">map</span>
                       Отвори в Google Maps
                    </button>
                 </div>
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold shadow-md text-[#0d1b12] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm filled">location_on</span>
                    {property.location}
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 relative">
             <div className="lg:sticky lg:top-24 flex flex-col gap-6">
                {/* Agent Card */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e7f3eb] overflow-hidden">
                   <div className="p-6 bg-gradient-to-br from-[#f8fcf9] to-white border-b border-gray-100">
                      <div className="flex items-center gap-4 mb-5">
                         <div className="size-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-green-50">
                           <img alt={displayBroker.name} className="w-full h-full object-cover" src={displayBroker.image} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Вашият брокер</p>
                            <h4 className="text-lg font-black text-[#0d1b12]">{displayBroker.name}</h4>
                            <div className="flex items-center gap-1 text-primary text-xs font-bold mt-1 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                               <span className="material-symbols-outlined text-[14px] filled">star</span>
                               <span>4.9 (124 отзива)</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-3">
                        <a href={`tel:${displayBroker.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-bold text-[#0d1b12] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                           <span className="material-symbols-outlined text-[20px]">call</span> Позвъни
                        </a>
                        <a href={`viber://chat?number=${displayBroker.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 flex items-center justify-center gap-2 bg-[#7360f2] border border-[#7360f2] rounded-xl py-3 text-sm font-bold text-white hover:bg-[#5e4ec2] hover:border-[#5e4ec2] transition-all shadow-sm">
                           <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.498 14.382c-.301-.582-.763-.985-1.127-1.139-.427-.183-.984-.13-1.488.136-.32.167-.655.393-.93.633-.186.162-.358.175-.583-.025-1.123-1.002-2.122-2.094-3.037-3.468-.147-.221-.194-.492.052-.75.244-.257.491-.513.782-.74.37-.289.566-.757.42-1.258-.164-.567-.502-1.114-.85-1.638-.346-.52-.767-.988-1.156-1.364-.462-.447-1.107-.46-1.576-.02-.455.426-.856.883-1.156 1.396-.543.926-.413 1.862.33 2.932.748 1.077 2.016 2.502 3.34 3.774 1.33 1.28 2.87 2.553 4.02 3.326 1.15.772 2.146.908 3.076.326 1.003-.627.91-1.928-.117-2.123zm-3.235-9.288c-.623 0-1.13.507-1.13 1.13 0 .624.507 1.13 1.13 1.13.623 0 1.13-.506 1.13-1.13 0-.623-.507-1.13-1.13-1.13zm1.695 2.26c-.476 0-.86.385-.86.86 0 .476.384.86.86.86.475 0 .86-.384.86-.86 0-.475-.385-.86-.86-.86zm-1.13-3.673c-.623 0-1.13.507-1.13 1.13 0 .623.507 1.13 1.13 1.13.623 0 1.13-.507 1.13-1.13 0-.623-.507-1.13-1.13-1.13zm-.565-3.68c-7.38 0-13.6 5.4-13.6 12.06 0 6.66 6.22 12.06 13.6 12.06 7.38 0 13.6-5.4 13.6-12.06 0-6.66-6.22-12.06-13.6-12.06z"/>
                           </svg>
                           Viber
                        </a>
                      </div>
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-[#0d1b12] mb-4">Заяви оглед или попитай</h3>
                      <form className="flex flex-col gap-4">
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">person</span>
                            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" placeholder="Вашето име" type="text"/>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">smartphone</span>
                            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" placeholder="Телефон за връзка" type="tel"/>
                        </div>
                        <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none transition-all" placeholder="Здравейте, интересувам се от този имот..." rows={3}></textarea>
                        
                        <div className="flex items-start gap-2 mb-2">
                            <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer" id="gdpr_check" />
                            <label htmlFor="gdpr_check" className="text-xs text-gray-500 cursor-pointer select-none">Съгласен съм с <a href="#" className="underline hover:text-primary">Общите условия</a> и Политиката за лични данни.</label>
                        </div>
                        
                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
                            <span>Изпрати запитване</span>
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                      </form>
                   </div>
                </div>
                
                {/* Calculator Banner */}
                <div className="bg-gradient-to-r from-[#e7f3eb] to-white p-5 rounded-2xl flex items-center gap-4 border border-[#cfe7d7] shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                   <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined filled">calculate</span>
                   </div>
                   <div>
                       <p className="text-sm font-bold text-[#0d1b12]">Кредитен калкулатор</p>
                       <span className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                           Изчисли вноска <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                       </span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-20 mb-8 border-t border-gray-200 pt-12">
             <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0d1b12] mb-2">Подобни предложения</h2>
                    <p className="text-gray-500">Избрани имоти от категория "{property.category}"</p>
                </div>
                <Link to="/properties" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline">
                  Виж всички <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProperties.map((p) => (
                  <Link to={`/properties/${p.id}`} key={p.id} className="flex flex-col rounded-xl bg-white border border-[#e7f3eb] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                     <div className="w-full aspect-[4/3] bg-gray-200 relative overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image} alt={p.title} />
                        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#0d1b12] shadow-sm">
                            {p.currency === '€' ? `€${p.price.toLocaleString()}` : p.price}
                        </div>
                     </div>
                     <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2">
                           <h4 className="font-bold text-[#0d1b12] line-clamp-2 leading-tight group-hover:text-primary transition-colors">{p.title}</h4>
                           <p className="text-xs text-gray-500 mt-1 truncate">{p.location}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50 text-xs font-medium text-gray-500">
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">square_foot</span> {p.area} м²</span>
                           {p.beds !== undefined && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">bed</span> {p.beds}</span>}
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;