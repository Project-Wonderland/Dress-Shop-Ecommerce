import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Dress, DressCategory } from '../models/dress.model';

const SEED_DRESSES: Dress[] = [
  {
    id: 'seed-1',
    name: 'Aurelia Gold Silk Evening Gown',
    type: 'Haute Couture',
    price: 2450.00,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
    stock: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-2',
    name: 'Midnight Obsidian Velvet Gown',
    type: 'Evening Gown',
    price: 1890.00,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
    stock: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-3',
    name: 'Champagne Satin Bias Cut Slip',
    type: 'Silk Slip',
    price: 780.00,
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1000',
    stock: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-4',
    name: 'Ethereal Ivory Tulle Cocktail Dress',
    type: 'Cocktail',
    price: 1250.00,
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
    stock: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-5',
    name: 'Scarlet Royal Crepe Column Gown',
    type: 'Evening Gown',
    price: 2100.00,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
    stock: 6,
    created_at: new Date().toISOString()
  },
  {
    id: 'seed-6',
    name: 'Monochrome Sculptural Runway Dress',
    type: 'Runway',
    price: 3200.00,
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
    stock: 2,
    created_at: new Date().toISOString()
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabaseService = inject(SupabaseService);

  // Signals
  dresses = signal<Dress[]>(SEED_DRESSES);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Filters & Sorting Signals
  selectedCategory = signal<DressCategory>('All');
  searchQuery = signal<string>('');
  sortBy = signal<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Computed Filtered List
  filteredDresses = computed(() => {
    let list = [...this.dresses()];

    // Category Filter
    const category = this.selectedCategory();
    if (category !== 'All') {
      list = list.filter(d => d.type.toLowerCase() === category.toLowerCase());
    }

    // Search Query Filter
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.type.toLowerCase().includes(query)
      );
    }

    // Sorting
    const sort = this.sortBy();
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  });

  constructor() {
    this.fetchDresses();
  }

  async fetchDresses() {
    this.loading.set(true);
    this.error.set(null);

    if (this.supabaseService.isMockMode) {
      this.loading.set(false);
      return;
    }

    try {
      const { data, error } = await this.supabaseService.client
        .from('dresses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice, maintaining seed data:', error.message);
      } else if (data && data.length > 0) {
        this.dresses.set(data as Dress[]);
      }
    } catch (err: any) {
      console.warn('Error fetching dresses:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Conflict-Free Image Upload Handler & Product Creation
   * 1. Intercept file input.
   * 2. Prepend Date.now() + crypto.randomUUID() to prevent filename collisions.
   * 3. Upload to `dress-images` bucket.
   * 4. Get public URL.
   * 5. Insert new record into `public.dresses`.
   */
  async createDress(
    dressData: { name: string; type: string; price: number; stock: number },
    file: File | null,
    previewUrl?: string
  ): Promise<{ success: boolean; error?: string }> {
    this.loading.set(true);
    let finalImageUrl = previewUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000';

    if (file && !this.supabaseService.isMockMode) {
      try {
        // Conflict-Proof Filename Generation
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const conflictFreeFileName = `${Date.now()}_${crypto.randomUUID()}_${safeName}`;

        // Upload to Supabase Storage Bucket `dress-images`
        const { data: uploadData, error: uploadError } = await this.supabaseService.client.storage
          .from('dress-images')
          .upload(conflictFreeFileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          this.loading.set(false);
          return { success: false, error: `Image upload failed: ${uploadError.message}` };
        }

        // Get Public URL
        const { data: publicUrlData } = this.supabaseService.client.storage
          .from('dress-images')
          .getPublicUrl(conflictFreeFileName);

        if (publicUrlData?.publicUrl) {
          finalImageUrl = publicUrlData.publicUrl;
        }
      } catch (err: any) {
        console.warn('Storage upload notice, utilizing image preview:', err);
      }
    } else if (file && this.supabaseService.isMockMode) {
      // In mock mode, convert file to data URL for immediate local preview
      finalImageUrl = await this.fileToDataUrl(file);
    }

    const newDressItem: Dress = {
      id: crypto.randomUUID(),
      name: dressData.name,
      type: dressData.type,
      price: Number(dressData.price),
      stock: Number(dressData.stock),
      image_url: finalImageUrl,
      created_at: new Date().toISOString()
    };

    if (!this.supabaseService.isMockMode) {
      try {
        const { data, error } = await this.supabaseService.client
          .from('dresses')
          .insert({
            id: newDressItem.id,
            name: newDressItem.name,
            type: newDressItem.type,
            price: newDressItem.price,
            stock: newDressItem.stock,
            image_url: newDressItem.image_url
          })
          .select()
          .single();

        if (error) {
          this.loading.set(false);
          return { success: false, error: error.message };
        }

        if (data) {
          newDressItem.id = data.id;
        }
      } catch (err: any) {
        console.warn('DB Insert notice:', err);
      }
    }

    // Update local Signal state immediately for zero-delay UI update
    this.dresses.update(current => [newDressItem, ...current]);
    this.loading.set(false);
    return { success: true };
  }

  async updateStock(id: string, newStock: number): Promise<boolean> {
    this.dresses.update(list =>
      list.map(item => item.id === id ? { ...item, stock: newStock } : item)
    );

    if (!this.supabaseService.isMockMode) {
      await this.supabaseService.client
        .from('dresses')
        .update({ stock: newStock })
        .eq('id', id);
    }
    return true;
  }

  async deleteDress(id: string): Promise<boolean> {
    this.dresses.update(list => list.filter(item => item.id !== id));

    if (!this.supabaseService.isMockMode) {
      await this.supabaseService.client
        .from('dresses')
        .delete()
        .eq('id', id);
    }
    return true;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}
