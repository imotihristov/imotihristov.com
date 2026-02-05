import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { uploadImages } from '../lib/services/storageService';

const propertyCategories = {
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

const bulgarianCities = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора", "Плевен", "Сливен", "Добрич", "Шумен",
  "Перник", "Хасково", "Ямбол", "Пазарджик", "Благоевград", "Велико Търново", "Враца", "Габрово", "Асеновград",
  "Видин", "Казанлък", "Кюстендил", "Кърджали", "Монтана", "Димитровград", "Търговище", "Ловеч", "Силистра",
  "Разград", "Дупница", "Горна Оряховица", "Свищов", "Петрич", "Смолян", "Сандански", "Самоков", "Велинград",
  "Севлиево", "Лом", "Карлово", "Троян", "Нова Загора", "Ботевград", "Банско", "Поморие", "Несебър", "Балчик",
  "Каварна", "Созопол", "Приморско", "Царево"
];

const DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDlnebd8O-PEelo_8CuP6G5HUJyRRDh8FLHmb04BZP4jziabyltYtSkTLjQe_evYQTwguFG3T4Y5weVAssjmPBO_0cTqHx2Wi4p27edOgo1ycopkCf4x2Wvq72utXwmi_Hwbvqjt1soX79ToyndVKg8ElLrhFdkbRyXG1dNGVyAHqECBauIb7aUXSoyHalEGIhQhwrBIUlj__6borFKMS94mlvmQK8rWUzFZq-XJdbgb1uzw4UfUK2--xg3gEmgDhtvzuYpPNfv9A';

interface ImagePreview {
  url: string;
  file?: File;
  isExisting?: boolean;
}

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { addProperty, brokers } = useProperties();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: '€',
    dealType: 'sale',
    category: '',
    area: 0,
    beds: 0,
    rooms: 0,
    floor: '',
    constructionType: '',
    city: 'София',
    neighborhood: '',
    street: '',
    features: [] as string[],
    brokerId: ''
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (feature: string) => {
    setFormData(prev => {
      if (prev.features.includes(feature)) {
        return { ...prev, features: prev.features.filter(f => f !== feature) };
      }
      return { ...prev, features: [...prev.features, feature] };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setPendingFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];
    
    // Revoke the object URL to avoid memory leaks
    if (preview.file) {
      URL.revokeObjectURL(preview.url);
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setPendingFiles(prev => {
      const newFiles = [...prev];
      // Find and remove the corresponding file
      const fileIndex = prev.findIndex(f => f === preview.file);
      if (fileIndex > -1) {
        newFiles.splice(fileIndex, 1);
      }
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category) {
      alert("Моля попълнете задължителните полета!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let uploadedImageUrls: string[] = [];
      
      // Upload images to Supabase Storage if there are any
      if (pendingFiles.length > 0) {
        setUploadProgress('Качване на снимки...');
        try {
          uploadedImageUrls = await uploadImages(pendingFiles);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          // Continue with default image if upload fails
        }
      }

      // Use first uploaded image as main image, or default if none
      const mainImage = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : DEFAULT_IMAGE;

      setUploadProgress('Запазване на имота...');
      
      await addProperty({
        title: formData.title,
        description: formData.description,
        location: `${formData.neighborhood ? formData.neighborhood + ', ' : ''}${formData.city}`,
        city: formData.city,
        neighborhood: formData.neighborhood,
        price: Number(formData.price),
        currency: formData.currency,
        area: Number(formData.area),
        beds: Number(formData.beds),
        rooms: Number(formData.rooms),
        floor: formData.floor,
        type: formData.dealType === 'rent' ? 'rent' : 'sale',
        category: formData.category,
        constructionType: formData.constructionType,
        image: mainImage,
        images: uploadedImageUrls,
        features: formData.features,
        status: 'active',
        isNew: true,
        brokerId: formData.brokerId ? Number(formData.brokerId) : undefined
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Грешка при добавяне на имота. Моля, опитайте отново.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  // Helper to determine field visibility
  const showBedrooms = [
    "Едностаен апартамент", "Двустаен апартамент", "Тристаен апартамент", "Многостаен апартамент",
    "Мезонет", "Етаж от къща", "Къща/Вила"
  ].includes(formData.category);

  const showRooms = [
    "Едностаен апартамент", "Двустаен апартамент", "Тристаен апартамент", "Многостаен апартамент",
    "Мезонет", "Боксониера", "Гарсониера", "Етаж от къща", "Къща/Вила", "Офис"
  ].includes(formData.category);

  const showFloor = [
    "Едностаен апартамент", "Двустаен апартамент", "Тристаен апартамент", "Многостаен апартамент",
    "Мезонет", "Боксониера", "Гарсониера", "Етаж от къща", "Офис", "Офис сграда/Търговски център",
    "Магазин", "Търговски помещения", "Заведение/Ресторант", "Козметично/Фризьорско студио", 
    "Медицински кабинет", "Аптека", "Фитнес"
  ].includes(formData.category);

  const showConstruction = ![
    "Парцел/Терен", "Земеделска земя", "Паркомясто/Гаражна клетка"
  ].includes(formData.category);

  return (
    <div className="w-full bg-[#f6f8f6] min-h-screen py-8">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center gap-4 mb-6">
             <Link to="/admin" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
             </Link>
             <div>
                <h1 className="text-2xl font-black text-[#0d1b12]">Добави нов имот</h1>
                <p className="text-gray-500 text-sm">Попълнете формата по-долу, за да публикувате вашата обява.</p>
             </div>
         </div>

         <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">description</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Основна информация</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="title">Заглавие на обявата *</label>
                     <input id="title" value={formData.title} onChange={handleChange} type="text" placeholder="Напр. Просторен тристаен апартамент в Лозенец" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" required disabled={isSubmitting} />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="description">Подробно описание *</label>
                     <textarea id="description" value={formData.description} onChange={handleChange} placeholder="Опишете предимствата на имота, състоянието, обзавеждането и др." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-y min-h-[150px]" required disabled={isSubmitting}></textarea>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="price">Цена (€) *</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
                        <input id="price" value={formData.price || ''} onChange={handleChange} type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" required disabled={isSubmitting} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="dealType">Тип сделка</label>
                     <select id="dealType" value={formData.dealType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting}>
                        <option value="sale">Продажба</option>
                        <option value="rent">Наем</option>
                     </select>
                  </div>
               </div>
            </section>

            {/* Characteristics */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">analytics</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Характеристики</h2>
               </div>
               
               <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="category">Вид имот *</label>
                 <select 
                    id="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    required
                    disabled={isSubmitting}
                 >
                    <option value="">Изберете тип имот...</option>
                    {Object.entries(propertyCategories).map(([category, types]) => (
                      <optgroup key={category} label={category}>
                        {types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </optgroup>
                    ))}
                 </select>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="area">Площ (кв.м) *</label>
                     <input id="area" value={formData.area || ''} onChange={handleChange} type="number" placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" required disabled={isSubmitting} />
                  </div>
                  
                  {showBedrooms && (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Брой спални</label>
                       <input id="beds" value={formData.beds || ''} onChange={handleChange} type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" min="0" disabled={isSubmitting} />
                    </div>
                  )}

                  {showRooms && (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="rooms">Общо стаи</label>
                       <input id="rooms" value={formData.rooms || ''} onChange={handleChange} type="number" placeholder="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting} />
                    </div>
                  )}

                  {showFloor && (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="floor">Етаж</label>
                       <input id="floor" value={formData.floor} onChange={handleChange} type="text" placeholder="напр. 3 от 6" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting} />
                    </div>
                  )}

                  {showConstruction && (
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="constructionType">Тип строителство</label>
                       <select id="constructionType" value={formData.constructionType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting}>
                          <option value="">Изберете...</option>
                          <option value="Тухла">Тухла</option>
                          <option value="Панел">Панел</option>
                          <option value="ЕПК">ЕПК</option>
                          <option value="Гредоред">Гредоред</option>
                       </select>
                    </div>
                  )}
               </div>
            </section>

            {/* Location */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">location_on</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Локация</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="city">Град</label>
                     <input 
                        list="cities-list" 
                        id="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        type="text" 
                        placeholder="Изберете или въведете град..." 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" 
                        disabled={isSubmitting}
                     />
                     <datalist id="cities-list">
                       {bulgarianCities.map(city => <option key={city} value={city} />)}
                     </datalist>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="neighborhood">Квартал</label>
                     <input id="neighborhood" value={formData.neighborhood} onChange={handleChange} type="text" placeholder="Напр. Лозенец" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="street">Улица и номер</label>
                     <input id="street" value={formData.street} onChange={handleChange} type="text" placeholder="Напр. ул. Златовръх 15" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" disabled={isSubmitting} />
                  </div>
                  
                  {/* Map Visualization Placeholder */}
                  <div className="md:col-span-2 mt-2">
                    <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 h-48 flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
                        <span className="text-sm font-medium">Визуализация на картата</span>
                    </div>
                  </div>
               </div>
            </section>

             {/* Amenities */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">check_circle</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Удобства</h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Асансьор', 'Паркомясто', 'Гараж', 'Климатик', 'Тераса', 'Обзаведен', 'ТЕЦ', 'СОТ', 'Видеонаблюдение', 'Контрол на достъпа', 'Саниран', 'Газ'].map((am) => (
                    <label key={am} className="flex items-center gap-2 cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={formData.features.includes(am)}
                         onChange={() => handleCheckboxChange(am)}
                         className="rounded text-primary focus:ring-primary border-gray-300 w-5 h-5" 
                         disabled={isSubmitting}
                       />
                       <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{am}</span>
                    </label>
                  ))}
               </div>
            </section>

            {/* Images Upload Section */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">imagesmode</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Снимки</h2>
               </div>

               <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer relative group ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input 
                        type="file" 
                        multiple 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        disabled={isSubmitting}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="size-16 bg-white shadow-sm text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl filled">cloud_upload</span>
                        </div>
                        <p className="font-bold text-[#0d1b12] text-lg">Качете снимки на имота</p>
                        <p className="text-gray-500 text-sm mt-1">Дръпнете файлове тук или кликнете за избор</p>
                        <span className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm">Избор на файлове</span>
                        <p className="text-xs text-gray-400 mt-4">Поддържани формати: JPG, PNG. Макс размер: 10MB</p>
                    </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 group shadow-sm">
                                <img src={preview.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)} 
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-transform hover:scale-110"
                                        disabled={isSubmitting}
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                                {idx === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        Основна
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Broker Selection */}
            <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[#e7f3eb]">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-primary"><span className="material-symbols-outlined">badge</span></div>
                  <h2 className="text-xl font-bold text-[#0d1b12]">Отговорен брокер</h2>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="brokerId">Изберете брокер</label>
                  <select 
                    id="brokerId" 
                    value={formData.brokerId} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="">-- Изберете брокер --</option>
                    {brokers.map(broker => (
                      <option key={broker.id} value={broker.id}>{broker.name} - {broker.role}</option>
                    ))}
                  </select>
               </div>
            </section>

            <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-4">
               {uploadProgress && (
                 <p className="text-gray-500 text-sm">{uploadProgress}</p>
               )}
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full md:w-auto bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-[#0d1b12] text-lg font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
               >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0d1b12]"></div>
                      <span>Публикуване...</span>
                    </>
                  ) : (
                    <>
                      <span>Публикуване на имот</span>
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </>
                  )}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default AddProperty;
