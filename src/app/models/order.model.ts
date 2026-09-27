import { Dress } from './dress.model';

export interface Order {
  id: string;
  user_id: string;
  dress_id: string;
  quantity: number;
  created_at?: string;
  // Joined fields for rich UI display
  dress?: Dress;
  user_email?: string;
}

export interface CartItem {
  dress: Dress;
  quantity: number;
  selectedSize?: string;
}
