import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

const propertyCategories: Record<string, string[]> = {
  "Жилищни имоти": [
    "Едностаен апартамент", "Двустаен апартамент", "Тристаен апартамент", "Многостаен апартамент",
    "Мезонет", "Боксониера", "Гарсониера", "Етаж от къща", "Къща/Вила"
  ],
  "Търговски и бизнес обекти": [
    "Офис", "Офис сграда/Търговски център", "Магазин", "Търговски помещения",
    "Заведение/Ресторант", "Хотел/Мотел", "Козметично/Фризьорско студио",
    "Медицински кабинет", "Аптека", "Фитнес"
  ],
  "Промишлени и стопански обекти": [
    "Промишлен имот", "Цех/Склад", "Стопанска сграда/Ферма"
  ],
  "Земя и паркинг": [
    "Парцел/Терен", "Земеделска земя", "Гараж", "Паркомясто/Гаражна клетка"
  ]
};

const SearchResults: React.FC = () => {
  const { properties } = useProperties();
  const [searchParams] = useSearchParams();
  
  // Refactored state to support specific City/Neighborhood and Multiple Types
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    neighborhood: searchParams.get('hood') || '', // Capture neighborhood from URL
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    types: searchParams.get('propType') ? [searchParams.get('propType')!] : [] as string[],
    category: searchParams.get('type') === 'rent' ? 'rent' : 'sale' // 'buy' or 'rent'
  });

  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // State for expanded categories in the sidebar
  const [expandedCategories, setExpandedCategories] = useState<string[]>(Object.keys(propertyCategories));

  // Sync state with URL params on mount/change
  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      neighborhood: searchParams.get('hood') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      types: searchParams.get('propType') ? [searchParams.get('propType')!] : [] as string[],
      category: searchParams.get('type') === 'rent' ? 'rent' : 'sale'
    });
  }, [searchParams]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleTypeToggle = (type: string) => {
    setFilters(prev => {
      const isSelected = prev.types.includes(type);
      return {
        ...prev,
        types: isSelected 
          ? prev.types.filter(t => t !== type)
          : [...prev.types, type]
      };
    });
  };

  // 1. Calculate Available Cities (based on active properties and deal type)
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    properties.forEach(p => {
      if (p.status === 'active' && p.type === filters.category) {
        cities.add(p.city);
      }
    });
    return Array.from(cities).sort();
  }, [properties, filters.category]);

  // 2. Calculate Available Neighborhoods (based on selected city)
  const availableNeighborhoods = useMemo(() => {
    if (!filters.city) return [];
    const hoods = new Set<string>();
    properties.forEach(p => {
      if (p.status === 'active' && p.type === filters.category && p.city === filters.city && p.neighborhood) {
        hoods.add(p.neighborhood);
      }
    });
    return Array.from(hoods).sort();
  }, [properties, filters.category, filters.city]);

  // 3. Filter Properties Logic
  const filteredProperties = useMemo(() => {
    // Check specific search by ID in URL (overrides everything)
    const idParam = searchParams.get('id');
    if (idParam) {
      const searchedProperty = properties.filter(p => 
        p.status === 'active' && p.id === Number(idParam)
      );
      return searchedProperty;
    }

    let result = properties.filter(p => p.status === 'active');

    // Filter by Sale/Rent
    result = result.filter(p => p.type === filters.category);

    // Filter by City
    if (filters.city) {
      result = result.filter(p => p.city === filters.city);
    }

    // Filter by Neighborhood
    if (filters.neighborhood) {
      result = result.filter(p => p.neighborhood === filters.neighborhood);
    }

    // Filter by Price
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Filter by Types (Multiple selection)
    if (filters.types.length > 0) {
      result = result.filter(p => filters.types.includes(p.category));
    }

    // Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Newest (by ID desc)
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [properties, filters, sortBy, searchParams]);

  const clearFilters = () => {
    setFilters({
      city: '',
      neighborhood: '',
      minPrice: '',
      maxPrice: '',
      types: [],
      category: 'sale'
    });
  };

  // Helper to check if any filter is active
  const hasActiveFilters = Boolean(
    filters.city || 
    filters.neighborhood || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.types.length > 0
  );

  // Check if searching by ID
  const searchById = searchParams.get('id');
  const isSearchingById = Boolean(searchById);

  return (
    <div className="w-full bg-background-light py-6">
      {/* Breadcrumbs */}
      <div className="w-full bg-background-light pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex text-sm text-text-secondary">
            <ol className="inline-flex items-center space-x-2">
              <li className="inline-flex items-center">
                <Link className="hover:text-primary transition-colors" to="/">Начало</Link>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li className="inline-flex items-center">
                <span className="hover:text-primary transition-colors cursor-pointer">Търсене</span>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li className="inline-flex items-center">
                <span className="text-text-main font-medium">
                  {isSearchingById ? `Имот #${searchById}` : 'Резултати'}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden w-full flex items-center justify-between bg-white border border-[#e7f3eb] p-4 rounded-xl mb-4 shadow-sm font-bold text-text-main hover:border-primary transition-colors"
            >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">tune</span>
                  <span>Филтри</span>
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">!</span>
                  )}
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            <div className={`bg-white rounded-xl border border-[#e7f3eb] p-6 lg:sticky lg:top-24 shadow-sm transition-all duration-300 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-main">Филтри</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-text-secondary hover:text-primary font-medium"
                >
                  Изчисти
                </button>
              </div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Deal Type */}
                <div className="space-y-3">
                   <label className="text-sm font-medium text-text-main">Тип сделка</label>
                   <select 
                      value={filters.category} 
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 bg-[#f8fcf9] border border-[#e7f3eb] rounded-lg text-sm focus:ring-primary focus:border-primary"
                   >
                     <option value="sale">Продажба</option>
                     <option value="rent">Наем</option>
                   </select>
                </div>

                {/* City */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-main">Град</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[20px]">location_city</span>
                    <select 
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value, neighborhood: ''})}
                      className="w-full pl-10 pr-8 py-2 bg-[#f8fcf9] border border-[#e7f3eb] rounded-lg text-sm focus:ring-primary focus:border-primary appearance-none" 
                    >
                      <option value="">Всички градове</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 text-text-secondary text-[20px] pointer-events-none"></span>
                  </div>
                </div>

                {/* Neighborhood - Dependent on City */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${!filters.city ? 'text-gray-400' : 'text-text-main'}`}>Квартал</label>
                  <div className="relative">
                    <span className={`material-symbols-outlined absolute left-3 top-2.5 text-[20px] ${!filters.city ? 'text-gray-300' : 'text-text-secondary'}`}>holiday_village</span>
                    <select 
                      value={filters.neighborhood}
                      onChange={(e) => setFilters({...filters, neighborhood: e.target.value})}
                      disabled={!filters.city}
                      className={`w-full pl-10 pr-8 py-2 bg-[#f8fcf9] border border-[#e7f3eb] rounded-lg text-sm focus:ring-primary focus:border-primary appearance-none ${!filters.city ? 'cursor-not-allowed opacity-60' : ''}`} 
                    >
                      <option value="">Всички квартали</option>
                      {availableNeighborhoods.map(hood => (
                        <option key={hood} value={hood}>{hood}</option>
                      ))}
                    </select>
                    <span className={`material-symbols-outlined absolute right-3 top-2.5 text-[20px] pointer-events-none ${!filters.city ? 'text-gray-300' : 'text-text-secondary'}`}></span>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-main">Цена (€)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full px-3 py-2 bg-[#f8fcf9] border border-[#e7f3eb] rounded-lg text-sm focus:ring-primary focus:border-primary" 
                      placeholder="От" 
                      type="number"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full px-3 py-2 bg-[#f8fcf9] border border-[#e7f3eb] rounded-lg text-sm focus:ring-primary focus:border-primary" 
                      placeholder="До" 
                      type="number"
                    />
                  </div>
                </div>

                {/* Property Types - Accordion */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-main">Тип имот</label>
                  <div className="space-y-1">
                    {Object.entries(propertyCategories).map(([category, types]) => {
                      const isExpanded = expandedCategories.includes(category);
                      const hasSelectedChild = types.some(t => filters.types.includes(t));

                      return (
                        <div key={category} className="border border-[#e7f3eb] rounded-lg overflow-hidden bg-[#f8fcf9]">
                          <button
                            onClick={() => toggleCategory(category)}
                            className={`w-full flex items-center justify-between p-3 text-left text-sm font-semibold transition-colors ${hasSelectedChild ? 'text-primary bg-green-50' : 'text-text-main hover:bg-gray-100'}`}
                          >
                            <span>{category}</span>
                            <span className={`material-symbols-outlined text-[18px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                          </button>
                          
                          {isExpanded && (
                            <div className="p-3 pt-0 border-t border-[#e7f3eb] bg-white">
                              <div className="space-y-2 mt-3">
                                {types.map(type => (
                                  <label key={type} className="flex items-start gap-3 cursor-pointer group">
                                    <input 
                                      checked={filters.types.includes(type)}
                                      onChange={() => handleTypeToggle(type)}
                                      className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" 
                                      type="checkbox"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-primary transition-colors leading-tight">{type}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
          </aside>

          {/* Main Results Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text-main leading-tight">
                  {isSearchingById ? `Търсене по ID: #${searchById}` : 'Резултати от търсенето'}
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'имот намерен' : 'имота намерени'}
                </p>
                {isSearchingById && filteredProperties.length > 0 && (
                  <Link 
                    to="/properties" 
                    className="text-primary text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Обратно към всички имоти
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary whitespace-nowrap hidden sm:block">Сортирай по:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#e7f3eb] text-text-main text-sm rounded-lg focus:ring-primary focus:border-primary block w-48 p-2.5 pr-8 cursor-pointer"
                  >
                    <option value="newest">Най-нови</option>
                    <option value="priceAsc">Цена: Ниска към Висока</option>
                    <option value="priceDesc">Цена: Висока към Ниска</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-text-secondary pointer-events-none"></span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <Link to={`/properties/${property.id}`} key={property.id} className="group bg-white rounded-xl border border-[#e7f3eb] overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={property.image} alt={property.title}/>
                    {property.isNew && <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">НОВО</div>}
                    {property.isTop && <div className="absolute top-3 left-3 bg-[#0d1b12] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">ТОП ОФЕРТА</div>}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">ID: #{property.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-1">{property.currency === '€' ? `€${property.price.toLocaleString()}` : `${property.currency.split(' ')[0]}${property.price} / месец`}</h3>
                      <h4 className="text-base font-semibold text-text-main line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h4>
                    </div>
                    <div className="flex items-start gap-1 text-text-secondary text-sm mb-4">
                      <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 py-3 border-t border-[#e7f3eb] mt-auto">
                        {/* Total Rooms */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-[18px] text-primary mb-1" title="Общо стаи">meeting_room</span>
                            <span className="text-sm font-bold text-[#0d1b12]">{property.rooms || (property.beds ? property.beds + 1 : '-')}</span>
                        </div>
                        {/* Bedrooms */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-[18px] text-primary mb-1" title="Спални">bed</span>
                            <span className="text-sm font-bold text-[#0d1b12]">{property.beds || '-'}</span>
                        </div>
                        {/* Floor */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-[18px] text-primary mb-1" title="Етаж">layers</span>
                            <span className="text-sm font-bold text-[#0d1b12]">{property.floor ? property.floor.split(' ')[0] : '-'}</span>
                        </div>
                        {/* Area */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-[18px] text-primary mb-1" title="Площ">square_foot</span>
                            <span className="text-sm font-bold text-[#0d1b12]">{property.area} m²</span>
                        </div>
                    </div>
                    <div className="w-full mt-3 py-2 border border-secondary text-text-secondary font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-sm text-center">
                       Виж детайли
                    </div>
                  </div>
                </Link>
              ))}
              {filteredProperties.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
                  <p className="text-gray-500 font-medium">
                    {isSearchingById 
                      ? `Имот с ID #${searchById} не е намерен или не е активен.`
                      : 'Няма имоти отговарящи на вашите критерии.'
                    }
                  </p>
                  {isSearchingById ? (
                    <Link to="/properties" className="text-primary hover:underline text-sm font-bold mt-2 inline-block">
                      Виж всички имоти
                    </Link>
                  ) : (
                    <button onClick={clearFilters} className="text-primary hover:underline text-sm font-bold mt-2">
                      Изчисти филтрите
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
