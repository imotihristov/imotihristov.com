import { supabase } from '../supabase';

export interface ContactMessage {
  id?: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  gdpr_consent: boolean;
  property_id?: number | null;
  is_read?: boolean;
  created_at?: string;
}

export const submitContactMessage = async (message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: message.name,
      phone: message.phone,
      email: message.email,
      subject: message.subject || 'general',
      message: message.message,
      gdpr_consent: message.gdpr_consent,
      property_id: message.property_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }

  return data;
};

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }

  return data || [];
};

export const fetchUnreadCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }

  return count || 0;
};

export const markMessageAsRead = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const deleteContactMessage = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};
