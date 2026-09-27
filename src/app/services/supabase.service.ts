import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  public isMockMode = false;

  constructor() {
    // Check if valid URL is provided; if placeholder, enable graceful fallback mock mode
    const isValidUrl = environment.supabaseUrl && !environment.supabaseUrl.includes('xyzcompany');
    if (isValidUrl) {
      this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
    } else {
      this.isMockMode = true;
      // Initialize with dummy URL to avoid library throws
      this.supabaseClient = createClient('https://mock-supabase-url.supabase.co', 'mock-key');
    }
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}
