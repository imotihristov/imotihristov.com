import { supabase } from '../supabase';
import type { Property, Broker } from '../../types';
import type { Database } from '../database.types';
import { deleteImages } from './storageService';

type PropertyRow = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type BrokerRow = Database['public']['Tables']['brokers']['Row'];
type BrokerInsert = Database['public']['Tables']['brokers']['Insert'];

// Helper to convert database row to app Property type
const mapDbToProperty = (row: PropertyRow): Property => ({
  id: row.id,
  title: row.title,
  description: row.description,
  location: row.location,
  city: row.city,
  neighborhood: row.neighborhood || undefined,
  price: Number(row.price),
  currency: row.currency,
  pricePerSqm: row.price_per_sqm ? Number(row.price_per_sqm) : undefined,
  image: row.image,
  images: row.images || undefined,
  beds: row.beds || undefined,
  baths: row.baths || undefined,
  rooms: row.rooms || undefined,
  floor: row.floor || undefined,
  area: Number(row.area),
  type: row.type as 'sale' | 'rent',
  category: row.category,
  constructionType: row.construction_type || undefined,
  isNew: row.is_new,
  isTop: row.is_top,
  isRecommended: row.is_recommended,
  status: row.status as 'active' | 'archived',
  date: row.date || new Date().toLocaleDateString('bg-BG'),
  features: row.features || [],
  brokerId: row.broker_id || undefined,
});

// Helper to convert app Property to database insert
const mapPropertyToDb = (property: Omit<Property, 'id' | 'date'>): PropertyInsert => ({
  title: property.title,
  description: property.description,
  location: property.location,
  city: property.city,
  neighborhood: property.neighborhood || null,
  price: property.price,
  currency: property.currency,
  price_per_sqm: property.pricePerSqm || null,
  image: property.image,
  images: property.images || [],
  beds: property.beds || null,
  baths: property.baths || null,
  rooms: property.rooms || null,
  floor: property.floor || null,
  area: property.area,
  type: property.type,
  category: property.category,
  construction_type: property.constructionType || null,
  is_new: property.isNew || false,
  is_top: property.isTop || false,
  is_recommended: property.isRecommended || false,
  status: property.status || 'active',
  date: new Date().toLocaleDateString('bg-BG'),
  features: property.features || [],
  broker_id: property.brokerId || null,
});

// Helper to convert database row to app Broker type
const mapDbToBroker = (row: BrokerRow): Broker => ({
  id: row.id,
  name: row.name,
  role: row.role,
  phone: row.phone,
  email: row.email,
  image: row.image,
});

// ==================== PROPERTY OPERATIONS ====================

export const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }

  return (data || []).map(mapDbToProperty);
};

export const fetchActiveProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active properties:', error);
    throw error;
  }

  return (data || []).map(mapDbToProperty);
};

export const fetchPropertyById = async (id: number): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    console.error('Error fetching property:', error);
    throw error;
  }

  return data ? mapDbToProperty(data) : null;
};

export const createProperty = async (property: Omit<Property, 'id' | 'date'>): Promise<Property> => {
  const dbProperty = mapPropertyToDb(property);
  
  const { data, error } = await supabase
    .from('properties')
    .insert(dbProperty)
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }

  return mapDbToProperty(data);
};

export const updateProperty = async (id: number, updates: Partial<Property>): Promise<Property> => {
  const dbUpdates: Partial<PropertyInsert> = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.neighborhood !== undefined) dbUpdates.neighborhood = updates.neighborhood || null;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
  if (updates.pricePerSqm !== undefined) dbUpdates.price_per_sqm = updates.pricePerSqm || null;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if (updates.images !== undefined) dbUpdates.images = updates.images || [];
  if (updates.beds !== undefined) dbUpdates.beds = updates.beds || null;
  if (updates.baths !== undefined) dbUpdates.baths = updates.baths || null;
  if (updates.rooms !== undefined) dbUpdates.rooms = updates.rooms || null;
  if (updates.floor !== undefined) dbUpdates.floor = updates.floor || null;
  if (updates.area !== undefined) dbUpdates.area = updates.area;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.constructionType !== undefined) dbUpdates.construction_type = updates.constructionType || null;
  if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
  if (updates.isTop !== undefined) dbUpdates.is_top = updates.isTop;
  if (updates.isRecommended !== undefined) dbUpdates.is_recommended = updates.isRecommended;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.features !== undefined) dbUpdates.features = updates.features || [];
  if (updates.brokerId !== undefined) dbUpdates.broker_id = updates.brokerId || null;

  const { data, error } = await supabase
    .from('properties')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }

  return mapDbToProperty(data);
};

export const deleteProperty = async (id: number): Promise<void> => {
  // First, get the property to retrieve its images
  const property = await fetchPropertyById(id);
  
  if (!property) {
    throw new Error('Property not found');
  }

  // Delete the property from database
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting property:', error);
    throw error;
  }

  // After successfully deleting from database, delete images from storage
  // We do this after to ensure the property is deleted even if image deletion fails
  if (property.images && property.images.length > 0) {
    try {
      await deleteImages(property.images);
    } catch (imageError) {
      console.warn('Failed to delete property images from storage:', imageError);
      // Don't throw error - property is already deleted from database
    }
  }
};

export const togglePropertyStatus = async (id: number, currentStatus: string): Promise<Property> => {
  const newStatus = currentStatus === 'active' ? 'archived' : 'active';
  return updateProperty(id, { status: newStatus as 'active' | 'archived' });
};

export const togglePropertyRecommended = async (id: number, currentValue: boolean): Promise<Property> => {
  return updateProperty(id, { isRecommended: !currentValue });
};

// ==================== BROKER OPERATIONS ====================

export const fetchBrokers = async (): Promise<Broker[]> => {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching brokers:', error);
    throw error;
  }

  return (data || []).map(mapDbToBroker);
};

export const fetchBrokerById = async (id: number): Promise<Broker | null> => {
  const { data, error } = await supabase
    .from('brokers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching broker:', error);
    throw error;
  }

  return data ? mapDbToBroker(data) : null;
};

export const createBroker = async (broker: Omit<Broker, 'id'>): Promise<Broker> => {
  const { data, error } = await supabase
    .from('brokers')
    .insert({
      name: broker.name,
      role: broker.role,
      phone: broker.phone,
      email: broker.email,
      image: broker.image,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating broker:', error);
    throw error;
  }

  return mapDbToBroker(data);
};

export const updateBroker = async (id: number, updates: Partial<Broker>): Promise<Broker> => {
  const { data, error } = await supabase
    .from('brokers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating broker:', error);
    throw error;
  }

  return mapDbToBroker(data);
};

export const deleteBroker = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('brokers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting broker:', error);
    throw error;
  }
};
