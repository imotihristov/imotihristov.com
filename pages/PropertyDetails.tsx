import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { supabase } from '../lib/supabase';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty, properties, brokers } = useProperties();
  
  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Gallery navigation (desktop grid view without opening lightbox)
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  // Mobile carousel
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  // Call modal (desktop: show phone number + copy)
  const [showCallModal, setShowCallModal] = useState(false);
  const [callCopied, setCallCopied] = useState(false);
  // Broker contact form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const brokerFormRef = useRef<HTMLFormElement>(null);

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
    email: "imotihristov@gmail.com",
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

  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const brokerPhone = displayBroker.phone.replace(/\s/g, '');
  const brokerPhoneForViber = brokerPhone.startsWith('+') ? brokerPhone : (brokerPhone.startsWith('0') ? '+359' + brokerPhone.slice(1) : '+359' + brokerPhone);

  // Desktop grid navigation (without opening lightbox)
  const nextGridImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGridIndex((prev) => (prev + 1) % slides.length);
  };

  const prevGridImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGridIndex((prev) => (prev + slides.length - 1) % slides.length);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    if (isMobile) return; // let default tel: link work
    e.preventDefault();
    setShowCallModal(true);
    setCallCopied(false);
  };

  const copyBrokerPhone = async () => {
    try {
      await navigator.clipboard.writeText(displayBroker.phone);
      setCallCopied(true);
      setTimeout(() => setCallCopied(false), 2000);
    } catch (_) {}
  };

  const handleBrokerFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brokerFormRef.current || !property) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(brokerFormRef.current);
      
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        propertyId: property.id.toString(),
        propertyTitle: property.title,
        location: property.location,
        broker: displayBroker.name,
        type: 'property'
      };

      console.log('Submitting property inquiry:', payload);
      
      const { data, error } = await supabase.functions.invoke('send-inquiry', {
        body: payload
      });

      console.log('Edge Function response:', { data, error });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }
      
      setIsSuccess(true);
      console.log('Property inquiry submitted successfully');
      
      // Reset form and button after 3 seconds
      setTimeout(() => {
        brokerFormRef.current?.reset();
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
        <section className="mb-4 md:mb-8">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            {/* Main Swipeable Image Container */}
            <div className="relative h-[300px] mb-3 rounded-xl overflow-hidden bg-gray-100">
              <div 
                className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const scrollLeft = container.scrollLeft;
                  const itemWidth = container.offsetWidth;
                  const index = Math.round(scrollLeft / itemWidth);
                  setMobileCarouselIndex(index);
                }}
              >
                {slides.map((slide, idx) => (
                  <div 
                    key={idx}
                    className="min-w-full h-full flex-shrink-0 snap-center snap-always cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url("${slide}")` }}></div>
                  </div>
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                {mobileCarouselIndex + 1} / {slides.length}
              </div>

              {property.isNew && <div className="absolute top-3 left-3 bg-primary text-[#ffffff] text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm z-10">Нов</div>}
            </div>

            {/* Thumbnail Preview Strip */}
            {slides.length > 1 && (
              <div className="flex gap-2 overflow-x-none pb-2 px-1 scrollbar-hide">
                {slides.map((slide, idx) => (
                  <button
                    key={idx}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === mobileCarouselIndex 
                        ? 'border-primary scale-105 shadow-lg' 
                        : 'border-gray-200 opacity-60'
                    }`}
                    onClick={() => {
                      const container = document.querySelector('.snap-x');
                      if (container) {
                        container.scrollTo({
                          left: idx * container.clientWidth,
                          behavior: 'smooth'
                        });
                      }
                      setMobileCarouselIndex(idx);
                    }}
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url("${slide}")` }}
                    ></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Gallery Grid */}
          <div className="hidden md:grid grid-cols-4 gap-4 h-[500px] rounded-xl overflow-hidden relative group">
            {/* Main Large Image with Navigation */}
            <div 
              className="col-span-3 h-full relative cursor-pointer overflow-hidden bg-gray-100"
              onClick={() => openLightbox(currentGridIndex)}
            >
              {slides[currentGridIndex] ? (
                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${slides[currentGridIndex]}")` }}></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Няма снимка</div>
              )}
              {property.isNew && <div className="absolute top-4 left-4 bg-primary text-[#ffffff] text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm z-10">Нов</div>}
              
              {/* Desktop Grid Navigation Arrows */}
              {slides.length > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full h-8 w-8 bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                    onClick={prevGridImage}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full h-8 w-8 bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                    onClick={nextGridImage}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    {currentGridIndex + 1} / {slides.length}
                  </div>
                </>
              )}
              
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none"></div>
            </div>
            
            {/* Side Images (Thumbnails that update main image) */}
            <div className="flex flex-col gap-4 h-full">
              {/* Top Side Image */}
              <div 
                className="flex-1 relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 border-2 border-transparent hover:border-primary transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slides.length > 1) setCurrentGridIndex(1);
                }}
              >
                {slides[1] && <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${slides[1]}")` }}></div>}
              </div>
              
              {/* Bottom Side Image with "See All" overlay */}
              <div 
                className="flex-1 relative cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                onClick={() => openLightbox(currentGridIndex)}
              >
                {slides[2] && <div className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105" style={{ backgroundImage: `url("${slides[2]}")` }}></div>}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/50">
                  <button className="flex items-center gap-2 text-white font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/50 transition-all pointer-events-none">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span>Виж всички</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button 
              className="absolute h-10 w-10 top-4 right-4 z-[110] p-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              onClick={closeLightbox}
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {/* Mobile Lightbox - Swipeable with Thumbnails */}
            <div className="md:hidden h-full flex flex-col items-center justify-center px-4 py-12">
              {/* Main Swipeable Container */}
              <div 
                className="w-[90vw] mb-4 relative"
                style={{ height: 'auto', maxHeight: '50vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollBehavior: 'smooth' }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollLeft = container.scrollLeft;
                    const itemWidth = container.offsetWidth;
                    const index = Math.round(scrollLeft / itemWidth);
                    setCurrentImageIndex(index);
                  }}
                >
                  {slides.map((slide, idx) => (
                    <div 
                      key={idx}
                      className="w-full h-full flex-shrink-0 snap-center snap-always flex items-center justify-center px-2"
                    >
                      <img 
                        src={slide} 
                        alt={`${property.title} - ${idx + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                  {currentImageIndex + 1} / {slides.length}
                </div>
              </div>

              {/* Thumbnail Preview Strip */}
              <div 
                className="w-full flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {slides.map((slide, idx) => (
                  <button
                    key={idx}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-primary scale-105 shadow-lg' 
                        : 'border-white/30 opacity-60'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const container = document.querySelector('.fixed.inset-0 .snap-x');
                      if (container) {
                        container.scrollTo({
                          left: idx * container.clientWidth,
                          behavior: 'smooth'
                        });
                      }
                      setCurrentImageIndex(idx);
                    }}
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url("${slide}")` }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Lightbox - Traditional with Arrows */}
            <div className="hidden md:flex items-center justify-center h-full">
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
          </div>
        )}

        {/* Call modal (desktop): show broker phone + copy */}
        {showCallModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCallModal(false)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#e7f3eb]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0d1b12]">Телефон на брокера</h3>
                <button type="button" onClick={() => setShowCallModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-2xl font-black text-primary mb-4">{displayBroker.phone}</p>
              <div className="flex gap-3">
                <a href={`tel:${brokerPhone}`} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-hover">
                  <span className="material-symbols-outlined">call</span> Позвъни
                </a>
                <button type="button" onClick={copyBrokerPhone} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-[#0d1b12] font-bold py-3 rounded-xl hover:bg-gray-200">
                  {callCopied ? <span className="text-green-600 text-sm">Копирано!</span> : <><span className="material-symbols-outlined">content_copy</span> Копирай</>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start">
          {/* Left Main Content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4 md:gap-8">
            
            {/* Main Info Card */}
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               {/* Property ID Badge */}
               <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-gray-50 border border-gray-200 rounded-lg mb-4">
                 <span className="material-symbols-outlined text-[18px] text-gray-400">tag</span>
                 <span className="text-sm font-bold text-gray-600">{property.id}</span>
               </div>

               {/* Title */}
               <h1 className="text-2xl md:text-3xl font-black text-[#0d1b12] mb-3 leading-tight">
                 {property.title}
               </h1>

               {/* Location */}
               <div className="flex items-center gap-2 text-text-secondary mb-4">
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
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 md:pt-8 border-t border-gray-100">
                  {/* Area */}
                  <div className="flex items-center gap-3">
                     <div className="size-10 md:size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined filled">square_foot</span>
                     </div>
                     <div>
                        <p className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wide mb-0.5">Площ</p>
                        <p className="font-bold text-[#0d1b12] text-sm md:text-lg leading-none">{property.area} кв.м</p>
                     </div>
                  </div>

                  {/* Bedrooms */}
                  {property.beds !== undefined && property.beds > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="size-10 md:size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">bed</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Спални</p>
                           <p className="font-bold text-[#0d1b12] text-sm md:text-lg leading-none">{property.beds}</p>
                        </div>
                    </div>
                  )}

                  {/* Floor */}
                  {property.floor && (
                    <div className="flex items-center gap-3">
                        <div className="size-10 md:size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">layers</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Етаж</p>
                           <p className="font-bold text-[#0d1b12] text-sm md:text-lg leading-none">{property.floor}</p>
                        </div>
                    </div>
                  )}

                  {/* Construction */}
                  {property.constructionType && (
                    <div className="flex items-center gap-3">
                        <div className="size-10 md:size-12 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                           <span className="material-symbols-outlined filled">domain</span>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Строителство</p>
                           <p className="font-bold text-[#0d1b12] text-sm md:text-lg leading-none">{property.constructionType}</p>
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
                           <p className="font-bold text-[#0d1b12] text-sm md:text-lg leading-none">{property.rooms}</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Description */}
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               <h3 className="text-xl font-bold text-[#0d1b12] mb-4">Описание на имота</h3>
               <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  <p>{property.description}</p>
               </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
               <h3 className="text-xl font-bold text-[#0d1b12] mb-6">Удобства и особености</h3>
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  {property.features.map(am => (
                    <div key={am} className="flex items-center gap-3 group">
                       <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform filled">check_circle</span>
                       <span className="text-gray-700 text-xs md:text-base font-medium">{am}</span>
                    </div>
                  ))}
                  {property.features.length === 0 && <p className="text-gray-500 italic">Няма въведени специфични удобства за този имот.</p>}
               </div>
            </div>

            {/* Map */}
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-sm border border-[#e7f3eb]">
              <h3 className="text-xl font-bold text-[#0d1b12] mb-4">Локация</h3>
              <div className="relative w-full h-[350px] rounded-xl overflow-hidden border border-gray-100">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.neighborhood ? `${property.neighborhood}, ${property.city}, Bulgaria` : `${property.city}, Bulgaria`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    title="Property Location Map"
                    className="w-full h-full"
                 ></iframe>
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold shadow-md text-[#0d1b12] flex items-center gap-2 pointer-events-none">
                    <span className="material-symbols-outlined text-primary text-sm filled">location_on</span>
                    {property.location}
                 </div>
                 <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.neighborhood ? `${property.neighborhood}, ${property.city}, Bulgaria` : `${property.city}, Bulgaria`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 bg-white text-[#0d1b12] px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:bg-primary hover:text-white transition-all"
                 >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    Отвори в Google Maps
                 </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 relative">
             <div className="lg:sticky lg:top-24 flex flex-col gap-6">
                {/* Agent Card */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e7f3eb] overflow-hidden">
                   <div className="p-4 md:p-6 lg:p-6 bg-gradient-to-br from-secondary-light to-white border-b border-gray-100">
                      <div className="flex items-center gap-4 mb-5">
                         <div className="size-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-green-50">
                           <img alt={displayBroker.name} className="w-full h-full object-cover" src={displayBroker.image} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Вашият брокер</p>
                            <h4 className="text-lg font-black text-[#0d1b12]">{displayBroker.name}</h4>
                            {/*<div className="flex items-center gap-1 text-primary text-xs font-bold mt-1 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                               <span className="material-symbols-outlined text-[14px] filled">star</span>
                               <span>4.9 (124 отзива)</span>
                            </div>*/}
                         </div>
                      </div>
                      <div className="flex gap-3">
                        {isMobile ? (
                          <a href={`tel:${brokerPhone}`} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-bold text-[#0d1b12] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                             <span className="material-symbols-outlined text-[20px]">call</span> Позвъни
                          </a>
                        ) : (
                          <button type="button" onClick={handleCallClick} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-bold text-[#0d1b12] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                             <span className="material-symbols-outlined text-[20px]">call</span> Позвъни
                          </button>
                        )}
                        <a href={`viber://chat?number=${brokerPhoneForViber.replace(/\D/g, '')}`} className="flex-1 flex items-center justify-center gap-2 bg-[#7360f2] border border-[#7360f2] rounded-xl py-3 text-sm font-bold text-white hover:bg-[#5e4ec2] hover:border-[#5e4ec2] transition-all shadow-sm" title="Отвори Viber">
                           {/*<img src="/viber.svg" alt="" className="w-5 h-5" />*/}
                           Viber
                        </a>
                      </div>
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-[#0d1b12] mb-4">Заяви оглед или попитай</h3>
                      <form 
                        ref={brokerFormRef}
                        className="flex flex-col gap-4" 
                        onSubmit={handleBrokerFormSubmit}
                      >
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">person</span>
                            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" placeholder="Вашето име" type="text" name="name" required disabled={isSubmitting || isSuccess} />
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" placeholder="Имейл адрес" type="email" name="email" required disabled={isSubmitting || isSuccess} />
                        </div>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">smartphone</span>
                            <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" placeholder="Телефон за връзка" type="tel" name="phone" required disabled={isSubmitting || isSuccess} />
                        </div>
                        <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none transition-all" placeholder="Здравейте, интересувам се от този имот..." rows={3} name="message" required disabled={isSubmitting || isSuccess}></textarea>
                        
                        <div className="flex items-start gap-2 mb-2">
                            <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer" id="gdpr_check" required disabled={isSubmitting || isSuccess} />
                            <label htmlFor="gdpr_check" className="text-xs text-gray-500 cursor-pointer select-none">Съгласен съм с <a href="#" className="underline hover:text-primary">Общите условия</a> и Политиката за лични данни.</label>
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={isSubmitting || isSuccess}
                          className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                            isSuccess 
                              ? 'bg-green-500 text-white cursor-default' 
                              : 'bg-primary hover:bg-primary-hover text-white shadow-green-200 hover:shadow-xl transform active:scale-[0.98]'
                          } ${(isSubmitting || isSuccess) ? 'cursor-not-allowed' : ''}`}
                        >
                           {isSuccess ? (
                             <>
                               <span>Изпратено</span>
                               <span className="material-symbols-outlined text-sm">check_circle</span>
                             </>
                           ) : isSubmitting ? (
                             <>
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                               <span>Изпращане...</span>
                             </>
                           ) : (
                             <>
                               <span>Изпрати запитване</span>
                               <span className="material-symbols-outlined text-sm">send</span>
                             </>
                           )}
                        </button>
                      </form>
                   </div>
                </div>
                
                {/* Calculator Banner *
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
                */}
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