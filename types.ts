export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  neighborhood?: string;
  price: number;
  currency: string;
  pricePerSqm?: number;
  image: string;
  images?: string[]; // For gallery
  beds?: number; // Optional for offices/land
  baths?: number; // Optional for land
  rooms?: number;
  floor?: string;
  area: number;
  type: 'sale' | 'rent';
  category: string; // e.g., "Тристаен апартамент", "Офис"
  constructionType?: string; // Brick, Panel, etc.
  isNew?: boolean;
  isTop?: boolean; // Highlighted
  isRecommended?: boolean; // Shows on Home page
  status: 'active' | 'archived';
  date: string;
  features: string[]; // Amenities like Elevator, Garage
  brokerId?: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  image: string;
  rating: number;
}

export interface Broker {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  image: string;
}