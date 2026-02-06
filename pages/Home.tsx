import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

// Dual Range Slider Component
const DualRangeSlider: React.FC<{
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (min: number, max: number) => void;
}> = ({ min, max, minVal, maxVal, onChange }) => {
  const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="relative w-full h-8 flex items-center">
      <style>{`
        /* Reset for all browsers */
        .thumb {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          pointer-events: none; /* Let the custom thumbs handle visuals, inputs handle events? No, inputs handle events */
        }
        
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto; /* Enable pointer events on the thumb itself */
          cursor: pointer;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: transparent; /* Invisible native thumb */
          border: none;
        }
        
        .thumb::-moz-range-thumb {
          -moz-appearance: none;
          pointer-events: auto;
          cursor: pointer;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: transparent;
          border: none;
        }

        /* Adjust stacking context to ensure both are clickable */
        .thumb-z-index-5 { z-index: 50; }
        .thumb-z-index-3 { z-index: 30; }
      `}</style>

      {/* Inputs are full height/width absolute to cover the area perfectly */}
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          onChange(value, maxVal);
        }}
        className={`thumb absolute inset-0 w-full h-full opacity-0 outline-none ${minVal > max - 100 ? 'thumb-z-index-5' : 'thumb-z-index-3'}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          onChange(minVal, value);
        }}
        className="thumb absolute inset-0 w-full h-full opacity-0 outline-none z-40"
      />

      {/* Visual Track and Thumbs */}
      <div className="relative w-full h-2 rounded bg-gray-200 pointer-events-none">
        {/* Active Range */}
        <div 
          className="absolute h-full rounded bg-primary"
          style={{ 
            left: `${getPercent(minVal)}%`, 
            width: `${getPercent(maxVal) - getPercent(minVal)}%` 
          }}
        ></div>
        
        {/* Visual Thumb Left */}
        <div 
          className="absolute w-5 h-5 bg-primary rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${getPercent(minVal)}%` }}
        />
        
        {/* Visual Thumb Right */}
        <div 
          className="absolute w-5 h-5 bg-primary rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${getPercent(maxVal)}%` }}
        />
      </div>
    </div>
  );
};

// Searchable Dropdown Component
interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, icon, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleFocus = () => {
    setSearchTerm('');
    setIsOpen(true);
  };

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`relative flex items-center w-full bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <span className={`material-symbols-outlined absolute left-3 text-gray-400`}>{icon}</span>
        <input
          type="text"
          className={`w-full pl-10 pr-8 py-2.5 bg-transparent border-none focus:ring-0 text-sm text-text-main placeholder:text-gray-400 ${disabled ? 'cursor-not-allowed' : ''}`}
          placeholder={value || placeholder}
          value={isOpen ? searchTerm : value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={handleFocus}
          disabled={disabled}
        />
        <span className="material-symbols-outlined absolute right-3 text-gray-400 pointer-events-none text-sm">expand_more</span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className="px-4 py-2 text-sm text-text-main hover:bg-green-50 hover:text-primary cursor-pointer transition-colors"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">Няма резултати</div>
          )}
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { properties } = useProperties();
  
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 10000, max: 1000000 });

  // Filter only active properties
  const activeProperties = useMemo(() => {
    return properties.filter(p => p.status === 'active' && p.type === (activeTab === 'buy' ? 'sale' : 'rent'));
  }, [properties, activeTab]);

  // Recommended properties (filtered from all active)
  const recommendedProperties = useMemo(() => {
    return properties.filter(p => p.status === 'active' && p.isRecommended).slice(0, 3);
  }, [properties]);

  // Latest properties
  const latestProperties = useMemo(() => {
    // Just taking the last 4 added properties for demo, in real app sort by date
    return [...properties].filter(p => p.status === 'active').sort((a,b) => b.id - a.id).slice(0, 4);
  }, [properties]);

  // Reset selections when tab changes
  useEffect(() => {
    setSelectedCity('');
    setSelectedNeighborhood('');
    setSelectedType('');
    setPriceRange(activeTab === 'buy' ? { min: 30000, max: 500000 } : { min: 200, max: 2000 });
  }, [activeTab]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    activeProperties.forEach(p => {
      const city = p.city || p.location.split(',')[0].trim();
      cities.add(city);
    });
    return Array.from(cities).sort();
  }, [activeProperties]);

  const availableNeighborhoods = useMemo(() => {
    if (!selectedCity) return [];
    const hoods = new Set<string>();
    activeProperties.forEach(p => {
      if (p.city === selectedCity && p.neighborhood) {
        hoods.add(p.neighborhood);
      }
    });
    return Array.from(hoods).sort();
  }, [activeProperties, selectedCity]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    let filteredProps = activeProperties;
    
    if (selectedCity) {
        filteredProps = filteredProps.filter(p => p.city === selectedCity);
    }
    if (selectedNeighborhood) {
        filteredProps = filteredProps.filter(p => p.neighborhood === selectedNeighborhood);
    }

    filteredProps.forEach(p => {
      if (p.category) types.add(p.category);
    });
    return Array.from(types).sort();
  }, [activeProperties, selectedCity, selectedNeighborhood]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?type=${activeTab}&city=${selectedCity}&hood=${selectedNeighborhood}&propType=${selectedType}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`);
  };

  const sliderMin = activeTab === 'buy' ? 10000 : 100;
  const sliderMax = activeTab === 'buy' ? 1000000 : 5000;

  return (
    <div>
      {/* Hero Section with Search Widget */}
      <section className="relative h-[90dvh] md:h-[90dvh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA1MLPFA4ICVsnWWQn19N_u9M-lLGs0W8UASQlTmthzZeLh40RqVvHvHN-_RN0lvrjEzCMPwOnBy9tBBtC45j3eCTUxRfAp0u0S9gUYPoI3nn3avVQt3xW3ZbqzWu2tVMFgWeB7QHcoC0fmKCofwpYgjVBKY0vk9cJ_nMVHQFYXrUphKFSQTztuwBNL8eJ-nOuMXEbx69rSiK4fhsnyMPA8qD1jF4NO7RuQPNsBNn9ZfrimAgzCsklu7ftFBDCi0NLOwigNKVuEOQw")` }}></div>
          <div className="absolute inset-0 bg-[#0d1b12]/40 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="hidden sm:block text-white text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">Открийте своя мечтан дом</h1>
              {/*<p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">Вашият надежден партньор в света на недвижимите имоти. Най-добрите оферти на пазара.</p>
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">Вашият надежден партньор в света на недвижимите имоти. Най-добрите оферти на пазара.</p> */}
           </div>

           {/* Search Widget Card */}
           <div className="bg-white rounded-2xl shadow-2xl max-w-5xl mx-auto p-6 md:p-10 pt-10 relative mt-8">
              
              {/* Floating Pill Toggle Switch - Overlapping top edge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white p-1 rounded-full flex relative cursor-pointer w-60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gray-100 rounded-full transition-all duration-300 ease-in-out ${activeTab === 'buy' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                  ></div>
                  <button
                    onClick={() => setActiveTab('buy')}
                    type="button"
                    className={`flex-1 relative z-10 text-center text-sm font-black uppercase tracking-wider py-2.5 transition-colors duration-300 ${activeTab === 'buy' ? 'text-text-main' : 'text-gray-500'}`}
                  >
                    Купи
                  </button>
                  <button
                    onClick={() => setActiveTab('rent')}
                    type="button"
                    className={`flex-1 relative z-10 text-center text-sm font-black uppercase tracking-wider py-2.5 transition-colors duration-300 ${activeTab === 'rent' ? 'text-text-main' : 'text-gray-500'}`}
                  >
                    Наеми
                  </button>
                </div>
              </div>

              <form onSubmit={handleSearch}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
                    {/* City */}
                    <div className="flex flex-col gap-2 relative z-40">
                       <label className="text-sm font-bold text-[#0d1b12]">Град/Област</label>
                       <SearchableSelect 
                         options={availableCities}
                         value={selectedCity}
                         onChange={(val) => {
                           setSelectedCity(val);
                           setSelectedNeighborhood('');
                           setSelectedType('');
                         }}
                         placeholder="Избери град..."
                         icon="location_city"
                       />
                    </div>

                    {/* Neighborhood */}
                    <div className="flex flex-col gap-2 relative z-30">
                       <label className={`text-sm font-bold ${!selectedCity ? 'text-gray-400' : 'text-[#0d1b12]'}`}>Квартал</label>
                       <SearchableSelect 
                         options={availableNeighborhoods}
                         value={selectedNeighborhood}
                         onChange={setSelectedNeighborhood}
                         placeholder={selectedCity ? (availableNeighborhoods.length ? "Избери квартал..." : "Няма налични") : "Първо изберете град"}
                         icon="holiday_village"
                         disabled={!selectedCity || availableNeighborhoods.length === 0}
                       />
                    </div>

                    {/* Property Type */}
                    <div className="flex flex-col gap-2 relative z-20">
                       <label className="text-sm font-bold text-[#0d1b12]">Тип имот</label>
                       <SearchableSelect 
                         options={availableTypes}
                         value={selectedType}
                         onChange={setSelectedType}
                         placeholder="Всички типове"
                         icon="home"
                       />
                    </div>

                    {/* Price Range Slider */}
                    <div className="flex flex-col gap-2 relative z-10">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-[#0d1b12]">Цена</label>
                          <span className="text-xs font-bold text-primary bg-green-50 px-2 py-0.5 rounded border border-green-100">
                             €{priceRange.min < 1000 ? priceRange.min : `${Math.floor(priceRange.min / 1000)}k`} - 
                             €{priceRange.max < 1000 ? priceRange.max : `${Math.floor(priceRange.max / 1000)}k`}
                          </span>
                       </div>
                       <div className="pt-2 px-1">
                          <DualRangeSlider 
                            min={sliderMin} 
                            max={sliderMax} 
                            minVal={priceRange.min}
                            maxVal={priceRange.max}
                            onChange={(min, max) => setPriceRange({ min, max })}
                          />
                       </div>
                    </div>
                 </div>

                 {/* Search Button Centered */}
                 <div className="flex justify-center">
                    <button type="submit" className="w-full md:w-64 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-lg">
                       <span className="material-symbols-outlined">search</span>
                       Търси
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </section>

      {/* Recommended Properties */}
      <section className="py-10 bg-secondary-light">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0d1b12]">Препоръчани имоти</h2>
                  <p className="text-text-secondary mt-1">Специално подбрани оферти за вас</p>
               </div>
               <Link to="/properties" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline">
                  Виж всички <span className="material-symbols-outlined">arrow_forward</span>
               </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
               {recommendedProperties.map((prop) => (
                  <Link to={`/properties/${prop.id}`} key={prop.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group block">
                     <div className="relative h-32 md:h-48 lg:h-64 overflow-hidden">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 left-4">
                           <span className={`hidden lg:block px-3 py-1 rounded-md text-xs font-bold uppercase text-white shadow-sm ${prop.type === 'sale' ? 'bg-primary' : 'bg-blue-500'}`}>
                              {prop.type === 'sale' ? 'Продажба' : 'Наем'}
                           </span>
                        </div>
                     </div>
                     <div className="p-2 lg:p-6">
                        <h3 className="text-lg lg:text-2xl font-black text-primary mb-2">{prop.currency === '€' ? `€ ${prop.price.toLocaleString()}` : `${prop.currency.split(' ')[0]} ${prop.price} / мес.`}</h3>
                        <h4 className="text-md font-bold text-[#0d1b12] mb-1 line-clamp-1">{prop.title}</h4>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                           <span className="material-symbols-outlined text-sm lg:text-[16px]">location_on</span>
                           {prop.location}
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-2 lg:pt-4 border-t border-gray-100">
                           {/* Total Rooms */}
                           <div className="flex flex-col items-center justify-center text-center">
                              <span className="material-symbols-outlined text-[18px] text-gray-400 mb-1" title="Общо стаи">meeting_room</span>
                              <span className="text-xs lg:text-sm font-bold text-[#0d1b12]">{prop.rooms || (prop.beds ? prop.beds + 1 : '-')}</span>
                           </div>
                           {/* Bedrooms */}
                           <div className="flex flex-col items-center justify-center text-center">
                              <span className="material-symbols-outlined text-[18px] text-gray-400 mb-1" title="Спални">bed</span>
                              <span className="text-xs lg:text-sm font-bold text-[#0d1b12]">{prop.beds || '-'}</span>
                           </div>
                           {/* Floor */}
                           <div className="flex flex-col items-center justify-center text-center">
                              <span className="material-symbols-outlined text-[18px] text-gray-400 mb-1" title="Етаж">layers</span>
                              <span className="text-xs lg:text-sm font-bold text-[#0d1b12]">{prop.floor ? prop.floor.split(' ')[0] : '-'}</span>
                           </div>
                           {/* Area */}
                           <div className="flex flex-col items-center justify-center text-center">
                              <span className="material-symbols-outlined text-[18px] text-gray-400 mb-1" title="Площ">square_foot</span>
                              <span className="text-[9px] lg:text-sm font-bold text-[#0d1b12]">{prop.area} m²</span>
                           </div>
                        </div>
                     </div>
                  </Link>
               ))}
               {recommendedProperties.length === 0 && (
                   <div className="col-span-3 text-center py-10 text-gray-500">
                       Няма препоръчани имоти в момента.
                   </div>
               )}
            </div>
            <div className="mt-6 sm:hidden text-center">
               <Link to="/properties" className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                  Виж всички <span className="material-symbols-outlined">arrow_forward</span>
               </Link>
            </div>
         </div>
      </section>

      {/* Latest Additions */}
      <section className="py-10 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0d1b12]">Последно добавени</h2>
                  <p className="text-text-secondary mt-1">Вижте най-новите предложения на пазара</p>
               </div>
               <Link to="/properties" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline">
                  Виж всички <span className="material-symbols-outlined">arrow_forward</span>
               </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
               {latestProperties.map((prop) => (
                  <Link to={`/properties/${prop.id}`} key={prop.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group block">
                     <div className="relative h-36 md:h-40 lg:h-48 overflow-hidden">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <div className="p-4">
                        <h3 className="text-lg font-black text-primary mb-1">{prop.currency === '€' ? `€ ${prop.price.toLocaleString()}` : `${prop.currency.split(' ')[0]} ${prop.price} / мес.`}</h3>
                        <h4 className="text-sm font-bold text-[#0d1b12] mb-1 line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-gray-500 mb-0">{prop.location}</p>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Sell Property CTA */}
      <section className="py-20 bg-[#0d1b12] relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Искате да продадете имот?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">Ние от "Имоти Христов" ще ви помогнем да намерите правилния купувач на най-добрата цена. Свържете се с нас за безплатна консултация.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/contact" className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-[#ffffff] font-bold rounded-lg shadow-lg shadow-green-900/20 transition-all">
                  Свържете се с нас
               </Link>
               <Link to="/services" className="px-8 py-3.5 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold rounded-lg transition-all">
                  Научете повече
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
