import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { Broker } from '../types';

const AdminDashboard: React.FC = () => {
  const { properties, brokers, deleteProperty, toggleStatus, toggleRecommended, addBroker, updateBroker, deleteBroker } = useProperties();
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'brokers'>('active');
  const navigate = useNavigate();

  // Broker Modal State
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [brokerForm, setBrokerForm] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    image: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този имот?')) {
      deleteProperty(id);
    }
  };

  const openAddBrokerModal = () => {
    setEditingBroker(null);
    setBrokerForm({ name: '', role: '', phone: '', email: '', image: '' });
    setIsBrokerModalOpen(true);
  };

  const openEditBrokerModal = (broker: Broker) => {
    setEditingBroker(broker);
    setBrokerForm({
      name: broker.name,
      role: broker.role,
      phone: broker.phone,
      email: broker.email,
      image: broker.image
    });
    setIsBrokerModalOpen(true);
  };

  const handleDeleteBroker = (id: number) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този брокер?')) {
      deleteBroker(id);
    }
  };

  const handleBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBroker) {
      updateBroker(editingBroker.id, brokerForm);
    } else {
      addBroker({
        ...brokerForm,
        image: brokerForm.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDlnebd8O-PEelo_8CuP6G5HUJyRRDh8FLHmb04BZP4jziabyltYtSkTLjQe_evYQTwguFG3T4Y5weVAssjmPBO_0cTqHx2Wi4p27edOgo1ycopkCf4x2Wvq72utXwmi_Hwbvqjt1soX79ToyndVKg8ElLrhFdkbRyXG1dNGVyAHqECBauIb7aUXSoyHalEGIhQhwrBIUlj__6borFKMS94mlvmQK8rWUzFZq-XJdbgb1uzw4UfUK2--xg3gEmgDhtvzuYpPNfv9A' // fallback image
      });
    }
    setIsBrokerModalOpen(false);
  };

  // Filter properties based on active tab
  const displayedProperties = properties.filter(p => activeTab === 'active' ? p.status === 'active' : p.status === 'archived');

  return (
    <div className="flex flex-1 min-h-screen bg-[#f6f8f6]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 py-8 px-4 border-r border-[#e7f3eb] bg-white sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-xl">real_estate_agent</span>
          </div>
          <span className="font-bold text-lg text-[#0d1b12]">Админ Панел</span>
        </div>

        <nav className="space-y-1 flex-1">
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'active' ? 'bg-green-50 text-primary' : 'text-gray-600 hover:bg-green-50/50 hover:text-primary'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'active' ? 'filled' : ''}`}>apartment</span>
            <span className="font-bold">Имоти</span>
          </button>

          <button 
            onClick={() => setActiveTab('brokers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'brokers' ? 'bg-green-50 text-primary' : 'text-gray-600 hover:bg-green-50/50 hover:text-primary'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'brokers' ? 'filled' : ''}`}>badge</span>
            <span className="font-bold">Брокери</span>
          </button>

          <button 
            onClick={() => setActiveTab('archived')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-green-50 text-primary' : 'text-gray-600 hover:bg-green-50/50 hover:text-primary'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'archived' ? 'filled' : ''}`}>inventory_2</span>
            <span className="font-bold">Архивирани</span>
            {properties.filter(p => p.status === 'archived').length > 0 && (
              <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {properties.filter(p => p.status === 'archived').length}
              </span>
            )}
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-auto"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Изход</span>
        </button>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0d1b12]">
              {activeTab === 'active' && 'Активни Обяви'}
              {activeTab === 'archived' && 'Архив на имоти'}
              {activeTab === 'brokers' && 'Управление на Брокери'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'brokers' ? 'Добавяне и редакция на профили' : 'Управление на портфолиото'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/" className="text-text-secondary hover:text-primary text-sm font-medium flex items-center gap-1">
               <span className="material-symbols-outlined text-[18px]">home</span>
               Към сайта
             </Link>
             {activeTab === 'active' && (
               <Link to="/admin/add-property" className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-[#0d1b12] font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                 <span className="material-symbols-outlined">add</span>
                 <span>Добави имот</span>
               </Link>
             )}
             {activeTab === 'brokers' && (
               <button onClick={openAddBrokerModal} className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-[#0d1b12] font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                 <span className="material-symbols-outlined">person_add</span>
                 <span>Нов брокер</span>
               </button>
             )}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e7f3eb]">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-sm font-medium text-gray-500">Общо имоти</p>
                 <span className="material-symbols-outlined text-primary bg-green-50 p-1.5 rounded-lg">domain</span>
              </div>
              <p className="text-2xl font-bold text-[#0d1b12]">{properties.length}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e7f3eb]">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-sm font-medium text-gray-500">Препоръчани</p>
                 <span className="material-symbols-outlined text-yellow-500 bg-yellow-50 p-1.5 rounded-lg filled">star</span>
              </div>
              <p className="text-2xl font-bold text-[#0d1b12]">{properties.filter(p => p.isRecommended).length}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e7f3eb]">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-sm font-medium text-gray-500">Брокери</p>
                 <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-1.5 rounded-lg">badge</span>
              </div>
              <p className="text-2xl font-bold text-[#0d1b12]">{brokers.length}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e7f3eb]">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-sm font-medium text-gray-500">Архивирани</p>
                 <span className="material-symbols-outlined text-gray-500 bg-gray-50 p-1.5 rounded-lg">inventory_2</span>
              </div>
              <p className="text-2xl font-bold text-[#0d1b12]">{properties.filter(p => p.status === 'archived').length}</p>
           </div>
        </div>

        {/* Content View */}
        {activeTab === 'brokers' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map(broker => (
                <div key={broker.id} className="bg-white rounded-xl shadow-sm border border-[#e7f3eb] p-6 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                   <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20 group-hover:border-primary transition-colors">
                      <img src={broker.image} alt={broker.name} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-bold text-lg text-[#0d1b12]">{broker.name}</h3>
                   <p className="text-primary text-sm font-medium mb-4">{broker.role}</p>
                   
                   <div className="w-full space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                         <span className="material-symbols-outlined text-sm">call</span>
                         {broker.phone}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                         <span className="material-symbols-outlined text-sm">mail</span>
                         {broker.email}
                      </div>
                   </div>

                   <div className="flex gap-2 w-full mt-auto">
                      <button 
                        onClick={() => openEditBrokerModal(broker)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm font-bold flex items-center justify-center gap-1"
                      >
                         <span className="material-symbols-outlined text-sm">edit</span> Редактирай
                      </button>
                      <button 
                        onClick={() => handleDeleteBroker(broker.id)}
                        className="p-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                         <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                   </div>
                </div>
              ))}
              {/* Add New Card Button */}
              <button onClick={openAddBrokerModal} className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-white transition-all cursor-pointer min-h-[300px]">
                  <span className="material-symbols-outlined text-5xl mb-2">add_circle</span>
                  <span className="font-bold">Добави нов брокер</span>
              </button>
           </div>
        ) : (
          /* Property Table */
          <div className="bg-white rounded-xl shadow-sm border border-[#e7f3eb] overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                         <th className="py-4 px-6 text-xs font-semibold uppercase text-gray-500 w-[40%]">Имот</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase text-gray-500">Статус</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase text-gray-500">Цена</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase text-gray-500">Дата</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase text-gray-500 text-right">Действия</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {displayedProperties.length > 0 ? (
                        displayedProperties.map(prop => (
                          <tr key={prop.id} className="hover:bg-green-50/50 transition-colors group">
                             <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                   <div className="h-16 w-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                      <img alt={prop.title} className="w-full h-full object-cover" src={prop.image}/>
                                      {prop.status !== 'active' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-[10px] font-bold uppercase border border-white/50 px-2 py-0.5 rounded backdrop-blur-sm">Скрит</span></div>}
                                      {prop.isRecommended && <div className="absolute top-1 left-1 bg-yellow-400 text-[#0d1b12] p-0.5 rounded shadow-sm"><span className="material-symbols-outlined text-[14px] block filled">star</span></div>}
                                   </div>
                                   <div>
                                      <h3 className="text-sm font-bold text-[#0d1b12] mb-1 line-clamp-1">{prop.title}</h3>
                                      <div className="flex items-center gap-1 text-xs text-gray-500"><span className="material-symbols-outlined text-[14px]">location_on</span>{prop.location}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${prop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                   <span className={`w-1.5 h-1.5 rounded-full ${prop.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                   {prop.status === 'active' ? 'Активен' : 'Архивиран'}
                                </span>
                             </td>
                             <td className="py-4 px-6">
                                <div className="text-sm font-bold text-[#0d1b12]">{prop.currency === '€' ? `€${prop.price.toLocaleString()}` : prop.price}</div>
                             </td>
                             <td className="py-4 px-6">
                                <div className="text-sm text-gray-600">{prop.date}</div>
                                <div className="text-xs text-gray-400">ID: #{prop.id}</div>
                             </td>
                             <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   {/* Toggle Recommended Button */}
                                   <button 
                                     onClick={() => toggleRecommended(prop.id)}
                                     title={prop.isRecommended ? "Премахни от препоръчани" : "Добави в препоръчани"}
                                     className={`size-8 rounded-full flex items-center justify-center transition-colors ${prop.isRecommended ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'hover:bg-yellow-50 text-gray-300 hover:text-yellow-500'}`}
                                   >
                                      <span className={`material-symbols-outlined text-[20px] ${prop.isRecommended ? 'filled' : ''}`}>star</span>
                                   </button>

                                   {/* Archive/Activate Button */}
                                   <button 
                                     onClick={() => toggleStatus(prop.id)}
                                     title={activeTab === 'active' ? "Архивирай" : "Активирай"}
                                     className={`size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ${activeTab === 'active' ? 'text-gray-400 hover:text-gray-600' : 'text-green-500 hover:bg-green-50'}`}
                                   >
                                      <span className="material-symbols-outlined text-[20px]">{activeTab === 'active' ? 'archive' : 'unarchive'}</span>
                                   </button>

                                   <button 
                                     title="Редактирай" 
                                     onClick={() => navigate(`/admin/edit-property/${prop.id}`)}
                                     className="size-8 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 flex items-center justify-center transition-colors"
                                   >
                                     <span className="material-symbols-outlined text-[20px]">edit</span>
                                   </button>
                                   
                                   <button 
                                     onClick={() => handleDelete(prop.id)}
                                     title="Изтрий" 
                                     className="size-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                                   >
                                     <span className="material-symbols-outlined text-[20px]">delete</span>
                                   </button>
                                </div>
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-500">
                             <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                                <p>Няма намерени имоти в тази категория.</p>
                             </div>
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>

      {/* Broker Modal */}
      {isBrokerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#0d1b12]">{editingBroker ? 'Редактиране на брокер' : 'Добавяне на нов брокер'}</h2>
                 <button onClick={() => setIsBrokerModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <form onSubmit={handleBrokerSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Име и Фамилия</label>
                    <input 
                      required
                      type="text" 
                      value={brokerForm.name}
                      onChange={(e) => setBrokerForm({...brokerForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Иван Иванов"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Позиция</label>
                    <input 
                      required
                      type="text" 
                      value={brokerForm.role}
                      onChange={(e) => setBrokerForm({...brokerForm, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Старши Брокер"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Телефон</label>
                      <input 
                        required
                        type="text" 
                        value={brokerForm.phone}
                        onChange={(e) => setBrokerForm({...brokerForm, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="+359..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Имейл</label>
                      <input 
                        required
                        type="email" 
                        value={brokerForm.email}
                        onChange={(e) => setBrokerForm({...brokerForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="email@example.com"
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Снимка (URL)</label>
                    <input 
                      type="text" 
                      value={brokerForm.image}
                      onChange={(e) => setBrokerForm({...brokerForm, image: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-400 mt-1">Оставете празно за снимка по подразбиране.</p>
                 </div>
                 <div className="pt-4 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsBrokerModalOpen(false)}
                      className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                    >
                       Отказ
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-primary text-[#0d1b12] font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-green-200"
                    >
                       {editingBroker ? 'Запази промените' : 'Добави брокер'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;