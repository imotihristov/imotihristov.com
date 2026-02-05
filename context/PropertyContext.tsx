import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, Broker } from '../types';

// Merged Mock Data from Home, Search, and Admin pages
const initialProperties: Property[] = [
  { 
    id: 1, 
    title: "Модерна вила в Бояна", 
    description: "Луксозна вила с панорамна гледка към Витоша и града. Разполага с голям двор, басейн и спа зона.",
    location: "София, Бояна", 
    city: "София",
    neighborhood: "Бояна",
    price: 450000, 
    currency: "€", 
    area: 280, 
    rooms: 6,
    beds: 4, 
    baths: 3, 
    floor: "2",
    type: "sale", 
    category: "Къща/Вила",
    isNew: true, 
    isRecommended: true,
    status: 'active',
    date: '12.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDlnebd8O-PEelo_8CuP6G5HUJyRRDh8FLHmb04BZP4jziabyltYtSkTLjQe_evYQTwguFG3T4Y5weVAssjmPBO_0cTqHx2Wi4p27edOgo1ycopkCf4x2Wvq72utXwmi_Hwbvqjt1soX79ToyndVKg8ElLrhFdkbRyXG1dNGVyAHqECBauIb7aUXSoyHalEGIhQhwrBIUlj__6borFKMS94mlvmQK8rWUzFZq-XJdbgb1uzw4UfUK2--xg3gEmgDhtvzuYpPNfv9A",
    features: ['Басейн', 'Гараж', 'СОТ', 'Климатик', 'Двор'],
    brokerId: 1
  },
  { 
    id: 2, 
    title: "Двустаен до Южен парк", 
    description: "Уютен двустаен апартамент на метри от входа на Южен парк. Напълно обзаведен и готов за нанасяне.",
    location: "Лозенец, София", 
    city: "София",
    neighborhood: "Лозенец",
    price: 175000, 
    currency: "€", 
    area: 85, 
    rooms: 2,
    beds: 1, 
    baths: 1, 
    floor: "3 от 5",
    type: "sale", 
    category: "Двустаен апартамент",
    isRecommended: true,
    status: 'active',
    date: '10.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcUKqd6hHyveTx0S1A_0TwjEt9h_V-8MzmYq2lMu9LLkCZn4phylPGK23l-1lxTHScRak4fvO2EQukXKsB0dVh022tccFL5DRRAzuW7adw6JAKyWXNBgipDIGfnigBHBNS5Zk2BM8GfsG4qIyu6r0AKTJUUPp3T5B3VV2eDG4iu-fFWax1cn28srkL6fknIIDd5GM9Tw23ajQSXTPxkqXBpGYgP6OxAsJzm4mDpCgKJnWow-CSM3KMI8msDQMd9Rz03phXga8UmkE",
    features: ['Асансьор', 'ТЕЦ', 'Тераса'],
    brokerId: 2
  },
  { 
    id: 4821, 
    title: "Просторен тристаен апартамент в Лозенец", 
    description: "Представяме ви изключителен тристаен апартамент в сърцето на Лозенец. Жилището е след основен ремонт.",
    location: "ул. Златовръх, София", 
    city: "София",
    neighborhood: "Лозенец",
    price: 185000, 
    currency: "€", 
    area: 110, 
    rooms: 3,
    beds: 2, 
    baths: 1, 
    floor: "3 от 6",
    type: "sale", 
    category: "Тристаен апартамент",
    constructionType: "Тухла",
    isRecommended: true,
    status: 'active',
    date: '12.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1MLPFA4ICVsnWWQn19N_u9M-lLGs0W8UASQlTmthzZeLh40RqVvHvHN-_RN0lvrjEzCMPwOnBy9tBBtC45j3eCTUxRfAp0u0S9gUYPoI3nn3avVQt3xW3ZbqzWu2tVMFgWeB7QHcoC0fmKCofwpYgjVBKY0vk9cJ_nMVHQFYXrUphKFSQTztuwBNL8eJ-nOuMXEbx69rSiK4fhsnyMPA8qD1jF4NO7RuQPNsBNn9ZfrimAgzCsklu7ftFBDCi0NLOwigNKVuEOQw",
    features: ['Асансьор', 'Паркомясто', 'Климатик', 'Обзаведен', 'ТЕЦ'],
    brokerId: 1
  },
  { 
    id: 4802, 
    title: "Лукс до метростанция", 
    description: "Елегантен имот в близост до мол Парадайз и метростанция Витоша.",
    location: "Хладилника, София", 
    city: "София",
    neighborhood: "Хладилника",
    price: 192000, 
    currency: "€", 
    area: 92, 
    rooms: 3,
    beds: 2, 
    baths: 1, 
    floor: "5 от 7",
    type: "sale", 
    category: "Тристаен апартамент",
    status: 'archived',
    date: '08.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtUovnMJ2gJtNPQtjrkjGeLyagVi-FMFZmyw5DzKkpS-q5YCO5OajRd_8YP_bzOYEqyzv4lCA4FX9lBzqgg6CoDtGz18wS-bybb7fjI0rA8AqrPNXqg7tLGrgu24kPKyQ4vAFRF4zuIRh_rn2LbboRRjZWeIlIngXm6tV3ZkzoF5Shpgy479VqjF6tZ6xqW6-U_xNDEUrlbc671Q2s2RVFBnav1w9Bj1DEFF7IkHiQsoWIn1ubO10UFmecJ6W8HRHe19IH1gtr3CQ",
    features: ['Лукс', 'Метро', 'Гараж'],
    brokerId: 2
  },
  { 
    id: 3, 
    title: "Тристаен за ремонт", 
    description: "Идеален за инвестиция. Жилището се нуждае от съвременен ремонт.",
    location: "ж.к. Надежда 2, София", 
    city: "София",
    neighborhood: "Надежда 2",
    price: 98500, 
    currency: "€", 
    area: 92, 
    rooms: 3,
    beds: 2, 
    baths: 1, 
    floor: "8 от 8",
    type: "sale", 
    category: "Тристаен апартамент",
    isTop: true,
    status: 'active',
    date: '15.04.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA359ed-f7jbtUwQnOht2UNgVRNyyogKMoWnAO7Q5P8cqGDgJZNQrmrVyxGQAnazz2OIfg0MeZ0gB3GDNYv_-G9T2nSxdNUsdmnZLpNN5XSyQ2CkeR8gEg2FQwMu5JsXDgjuXGlxXm2wjHN67DSnS3Q9M2bRv8x4ewP50yQnm6J3sRwT0m57J88U3cGRp-cPS9vkiha9QLZ0m1KggjN7iquSUh8J61raLgSt0r5F5dPTy-7oK6IOdopD564dsu7kzi_5XjH2-LTqHk",
    features: ['Асансьор', 'Панел'],
    brokerId: 1
  },
  { 
    id: 4, 
    title: "Панорамен апартамент", 
    description: "Спираща дъха гледка и просторни помещения.",
    location: "ж.к. Младост 4, София", 
    city: "София",
    neighborhood: "Младост 4",
    price: 155000, 
    currency: "€", 
    area: 110, 
    rooms: 4,
    beds: 3, 
    baths: 2, 
    floor: "6 от 8",
    type: "sale", 
    category: "Многостаен апартамент",
    status: 'active',
    date: '20.04.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3sPoCPmcQAbP261soNZEdJh-16BWqMFuF9ktr_ZqVd26S0Yhnx_vvI7yJUZ5qq6FcYNnMGc82SaXl-HfcbAR_4NN1Q1csuFTJT_bNI0VMmV5_S9soYVFVNOZp8meSJBr0PfaVNc75kM4AsuuFH1fJaCL2QuSxhSbYFpp31sXmWIPeuveGcvFqLRXyHtBPxy-ltVojokS7huM5zcEmBbIfdXMWjuifmIYT8C1Whftd9WzNE5V5GOACFX7rS2Z2Q3fAYg7tGIp_ypE",
    features: ['Асансьор', 'ТЕЦ', 'Паркинг'],
    brokerId: 2
  },
  { 
    id: 5, 
    title: "Офис в центъра", 
    description: "Представителен офис на бул. Витоша. Подходящ за адвокатска кантора или IT фирма.",
    location: "бул. Витоша, Център", 
    city: "София",
    neighborhood: "Център",
    price: 850, 
    currency: "€ / мес.", 
    area: 65, 
    rooms: 3,
    floor: "1 от 5",
    type: "rent", 
    category: "Офис",
    status: 'active',
    date: '01.06.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVA05sizhRojH6efRTGq5kIH2kMvvr_myKwZiE_QG7VZccrZRB7jcbKk9_vHEBtmc6P4zlPhNmRp1O8Be6Wkb7qyux8Yv3U0ghpGolJZ6TuCVP-oQ5_MvJV4y0x2ry8t_JOBI4EcpmblpBAH-wHSWCiVIOkgSzVRGymyNPwD6dceHmkIzfQEn66quOtTQ7UT-1_GN_eiN_g95vxxYfhniYEa2_oZIlQ8VTPsZ0U0LE8Ym9lKUDFVQg_aX38FdBe0jvWx-ZBeKsiJY",
    features: ['Климатик', 'Окабеляване'],
    brokerId: 1
  },
  { 
    id: 6, 
    title: "Апартамент с гараж", 
    description: "В цената е включен гараж 20кв.м.",
    location: "ж.к. Дружба 1, София", 
    city: "София",
    neighborhood: "Дружба 1",
    price: 115000, 
    currency: "€", 
    area: 78, 
    rooms: 3,
    beds: 2, 
    baths: 1, 
    floor: "2 от 9",
    type: "sale", 
    category: "Двустаен апартамент",
    status: 'active',
    date: '18.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9E3rkL4Q0xNktgt8eIrsDZzxZh6XfaTtVa6uHZiW_Lpw8tar6ZH9q0tSgQc8nVxLoEt0RFvMZ_BNBixbyNm_7shMoRl_zkY7sIZzF8Wloo_wpl9feT8i9ucFUBKyEH7r8h-DiRTKY4WajpsDJpQh7crwGVlePZ6tNYdmUGHZvmQmMlbyQsGXJ5GKyId_ZyYLmdk9ksynctxJJdQnowExNUC9olsemJSqzgmiCts1l9zjE9EqBA6C48ilsHlg-Z2IraDSZOqd-u0U",
    features: ['Гараж', 'Асансьор'],
    brokerId: 2
  },
  { 
    id: 7, 
    title: "Парцел за строеж", 
    description: "УПИ с ток и вода, подходящ за еднофамилна къща.",
    location: "Пловдив, Беломорски", 
    city: "Пловдив",
    neighborhood: "Беломорски",
    price: 85000, 
    currency: "€", 
    area: 500, 
    type: "sale", 
    category: "Парцел/Терен",
    status: 'active',
    date: '22.05.2023',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuJwxvGvusJ_uUBGi1mFm2WOreKRDzWc-sDbb2InhU-0ebv6_3zR15uRCS-DgWlJrBjOF7pGtlonavCGfo6ioutIF6fkyrX9-x_4TQvAq1XeB5mwp-P2biDSz47y4G3d_xZ6XrPLAKJaI0sGVaDgOrJMnARKMMXFUX2yhWXrs1-UcYel0XCDKzqbwpwmKooO7mtHRWm0PthdYe5i5aHBzCl060es0AsMRC0LZnI8ZF8FPK_WrNx-dDgItXsOgPHIBat4S4o_jDNKM",
    features: ['Ток', 'Вода'],
    brokerId: 1
  }
];

const initialBrokers: Broker[] = [
  { id: 1, name: "Мария Петрова", role: "Старши Брокер", phone: "+359 888 123 456", email: "maria@imotihristov.bg", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Aa4UYur7AVUi8FL2A9QYMzhTnVp1vO78A7gAdrRxV9YvmXl1WEf_1eBDdSdQRkUxjPYULE-FF6xGCPHhd_cANI6muK86KgbVvaz6kf5smPCvHg-Y2tBuOUDtoLZnVgksANth6sAI7McdtfWKVSRnm3hdzQvbvHkjl9DeSxhKcA2LkZzTs_nAHUsIz5PwniMLqe65BvLykyl-Opr-FZnhiGw-VxrasY5S3OKLkrYNGbAVedy5fQb9W-AXzzBxnc-qIOx7KiEMRvE" },
  { id: 2, name: "Георги Иванов", role: "Брокер", phone: "+359 887 654 321", email: "georgi@imotihristov.bg", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjGEGbRnetogiiTaRl-dAsZryk48ms_fn3oYpfv_7pu-SVp1gRzWW4Shn3YJS7QFmfzugGCc_43OWpMRYqQSBXhjXPZZ0mievS6M67sm-1_TJxjg0TvvX4sKB-UyP4nIfb8q4VdxWfqzDk7QjBHq6Yn_sLENvTYM-hReGt8RaSlyeR4S1lbkLKtMFRZHkV5Iuf7mPDqRZYQR8X_b-EGkwM4B-EIMtuNwUHduNhqWSoLmTRMb1PAO2XnfI4OY74ewnJJbDfr098duY" },
];

interface PropertyContextType {
  properties: Property[];
  brokers: Broker[];
  addProperty: (property: Omit<Property, 'id' | 'date'>) => void;
  updateProperty: (id: number, updatedData: Partial<Property>) => void;
  deleteProperty: (id: number) => void;
  toggleStatus: (id: number) => void;
  toggleRecommended: (id: number) => void;
  getProperty: (id: number) => Property | undefined;
  addBroker: (broker: Omit<Broker, 'id'>) => void;
  updateBroker: (id: number, updatedData: Partial<Broker>) => void;
  deleteBroker: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);

  const addProperty = (data: Omit<Property, 'id' | 'date'>) => {
    const newProperty: Property = {
      ...data,
      id: Math.max(0, ...properties.map(p => p.id)) + 1,
      date: new Date().toLocaleDateString('bg-BG'),
      status: 'active'
    };
    setProperties([newProperty, ...properties]);
  };

  const updateProperty = (id: number, updatedData: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProperty = (id: number) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const toggleStatus = (id: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'active' ? 'archived' : 'active' };
      }
      return p;
    }));
  };

  const toggleRecommended = (id: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isRecommended: !p.isRecommended };
      }
      return p;
    }));
  };

  const getProperty = (id: number) => properties.find(p => p.id === id);

  const addBroker = (data: Omit<Broker, 'id'>) => {
    const newBroker: Broker = {
      ...data,
      id: Math.max(0, ...brokers.map(b => b.id)) + 1
    };
    setBrokers([...brokers, newBroker]);
  };

  const updateBroker = (id: number, updatedData: Partial<Broker>) => {
    setBrokers(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  };

  const deleteBroker = (id: number) => {
    setBrokers(prev => prev.filter(b => b.id !== id));
  };

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      brokers,
      addProperty, 
      updateProperty, 
      deleteProperty, 
      toggleStatus, 
      toggleRecommended,
      getProperty,
      addBroker,
      updateBroker,
      deleteBroker
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
