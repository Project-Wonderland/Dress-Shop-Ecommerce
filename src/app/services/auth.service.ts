import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { UserProfile, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  // Auth Signals
  currentUser = signal<UserProfile | null>(null);
  userRole = signal<UserRole>('user');
  isAdmin = computed(() => this.userRole() === 'admin');
  authLoading = signal<boolean>(false);
  authError = signal<string | null>(null);

  // Lazy Auth Modal Signal
  showLazyAuthModal = signal<boolean>(false);
  private pendingAction = signal<(() => void) | null>(null);

  constructor() {
    this.initSession();
  }

  private async initSession() {
    if (this.supabaseService.isMockMode) {
      // Default to guest state in mock mode
      return;
    }

    try {
      const { data: { session } } = await this.supabaseService.client.auth.getSession();
      if (session?.user) {
        await this.handleUserAuthenticated(session.user.id, session.user.email);
      }

      this.supabaseService.client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await this.handleUserAuthenticated(session.user.id, session.user.email);
        } else {
          this.currentUser.set(null);
          this.userRole.set('user');
        }
      });
    } catch (err) {
      console.warn('Auth session init notice:', err);
    }
  }

  private async handleUserAuthenticated(userId: string, email?: string) {
    let role: UserRole = 'user';

    // Fetch user profile role from public.users table
    try {
      const { data, error } = await this.supabaseService.client
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (data && data.role) {
        role = data.role as UserRole;
      }
    } catch (e) {
      console.warn('Could not fetch user role, defaulting to user', e);
    }

    const profile: UserProfile = {
      id: userId,
      email: email,
      role: role
    };

    this.currentUser.set(profile);
    this.userRole.set(role);

    // If pending lazy action exists, execute it and reset
    const action = this.pendingAction();
    if (action) {
      action();
      this.pendingAction.set(null);
      this.showLazyAuthModal.set(false);
    }
  }

  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authLoading.set(true);
    this.authError.set(null);

    if (this.supabaseService.isMockMode) {
      // Mock auth signup
      const mockRole: UserRole = email.includes('admin') ? 'admin' : 'user';
      const mockUser: UserProfile = {
        id: 'mock-user-' + Date.now(),
        email: email,
        role: mockRole
      };
      this.currentUser.set(mockUser);
      this.userRole.set(mockRole);
      this.authLoading.set(false);

      const action = this.pendingAction();
      if (action) {
        action();
        this.pendingAction.set(null);
        this.showLazyAuthModal.set(false);
      }
      return { success: true };
    }

    try {
      const { data, error } = await this.supabaseService.client.auth.signUp({
        email,
        password
      });

      if (error) {
        this.authError.set(error.message);
        this.authLoading.set(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await this.handleUserAuthenticated(data.user.id, data.user.email);
      }

      this.authLoading.set(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred';
      this.authError.set(msg);
      this.authLoading.set(false);
      return { success: false, error: msg };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authLoading.set(true);
    this.authError.set(null);

    if (this.supabaseService.isMockMode) {
      // Mock auth signin
      const mockRole: UserRole = (email.includes('admin') || password === 'admin123') ? 'admin' : 'user';
      const mockUser: UserProfile = {
        id: 'mock-user-123',
        email: email,
        role: mockRole
      };
      this.currentUser.set(mockUser);
      this.userRole.set(mockRole);
      this.authLoading.set(false);

      const action = this.pendingAction();
      if (action) {
        action();
        this.pendingAction.set(null);
        this.showLazyAuthModal.set(false);
      }
      return { success: true };
    }

    try {
      const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.authError.set(error.message);
        this.authLoading.set(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await this.handleUserAuthenticated(data.user.id, data.user.email);
      }

      this.authLoading.set(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || 'Authentication failed';
      this.authError.set(msg);
      this.authLoading.set(false);
      return { success: false, error: msg };
    }
  }

  async signOut() {
    if (!this.supabaseService.isMockMode) {
      await this.supabaseService.client.auth.signOut();
    }
    this.currentUser.set(null);
    this.userRole.set('user');
    this.router.navigate(['/']);
  }

  // Trigger Lazy Auth Modal
  triggerLazyAuth(onSuccessAction?: () => void) {
    if (this.currentUser()) {
      if (onSuccessAction) onSuccessAction();
    } else {
      if (onSuccessAction) this.pendingAction.set(() => onSuccessAction);
      this.showLazyAuthModal.set(true);
    }
  }

  closeLazyAuthModal() {
    this.showLazyAuthModal.set(false);
    this.pendingAction.set(null);
  }
}
