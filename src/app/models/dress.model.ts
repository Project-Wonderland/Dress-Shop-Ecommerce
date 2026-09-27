export interface Dress {
  id: string;
  name: string;
  type: string;
  price: number;
  image_url: string;
  stock: number;
  created_at?: string;
}

export type DressCategory = 'All' | 'Haute Couture' | 'Evening Gown' | 'Silk Slip' | 'Cocktail' | 'Runway';
