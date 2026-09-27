import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lazy-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (authService.showLazyAuthModal()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <!-- Dialog Container -->
        <div class="relative w-full max-w-md overflow-hidden rounded-xl border border-stone-800 bg-[#121212] p-8 shadow-2xl animate-slide-up">

          <!-- Close Button -->
          <button (click)="authService.closeLazyAuthModal()" class="absolute top-4 right-4 text-stone-500 hover:text-stone-100 transition-colors">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Header Title -->
          <div class="text-center">
            <span class="font-serif text-[11px] font-semibold tracking-widest uppercase text-champagne-600">
              Maison Élégance Privé
            </span>
            <h2 class="mt-1 font-serif text-2xl font-bold text-stone-100">
              Sign In to Complete Your Order
            </h2>
            <p class="mt-1.5 text-xs text-stone-400">
              Create an account or log in to secure your haute couture selection. Your order will complete automatically upon sign-in.
            </p>
          </div>

          <!-- Auth Mode Tabs (Sign In / Sign Up) -->
          <div class="mt-6 flex rounded-lg border border-stone-800 bg-stone-900 p-1">
            <button
              (click)="activeTab.set('signin')"
              [class.bg-[#121212]="activeTab() === 'signin'"
              [class.text-champagne-500]="activeTab() === 'signin'"
              [class.text-stone-400]="activeTab() !== 'signin'"
              class="flex-1 rounded-md py-2 text-xs font-semibold tracking-wider transition-all">
              Sign In
            </button>
            <button
              (click)="activeTab.set('signup')"
              [class.bg-[#121212]="activeTab() === 'signup'"
              [class.text-champagne-500]="activeTab() === 'signup'"
              [class.text-stone-400]="activeTab() !== 'signup'"
              class="flex-1 rounded-md py-2 text-xs font-semibold tracking-wider transition-all">
              Create Account
            </button>
          </div>

          <!-- Error Alert -->
          @if (authService.authError()) {
            <div class="mt-4 rounded-md border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
              ⚠️ {{ authService.authError() }}
            </div>
          }

          <!-- Form Inputs -->
          <form (ngSubmit)="onSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-[11px] font-medium uppercase tracking-widest text-stone-300">
                Email Address
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="client@maison.com"
                class="mt-1.5 w-full rounded border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none focus:ring-1 focus:ring-champagne-600"
              />
            </div>

            <div>
              <label class="block text-[11px] font-medium uppercase tracking-widest text-stone-300">
                Password
              </label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••••••"
                class="mt-1.5 w-full rounded border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none focus:ring-1 focus:ring-champagne-600"
              />
            </div>

            <button
              type="submit"
              [disabled]="authService.authLoading()"
              class="w-full rounded border border-champagne-600 bg-champagne-600 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all disabled:opacity-50">
              @if (authService.authLoading()) {
                <span class="inline-flex items-center space-x-2">
                  <svg class="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </span>
              } @else {
                <span>{{ activeTab() === 'signin' ? 'Sign In & Complete Order' : 'Create Account & Place Order' }}</span>
              }
            </button>
          </form>

          <!-- Quick Fill Demo Button -->
          <div class="mt-6 border-t border-stone-800/80 pt-4 text-center">
            <button
              (click)="fillDemoUser()"
              type="button"
              class="text-[11px] text-stone-400 hover:text-champagne-500 underline transition-colors">
              ⚡ Quick Fill Client Demo Credentials
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class LazyAuthModalComponent {
  authService = inject(AuthService);

  activeTab = signal<'signin' | 'signup'>('signin');
  email = '';
  password = '';

  async onSubmit() {
    if (!this.email || !this.password) return;

    if (this.activeTab() === 'signin') {
      await this.authService.signIn(this.email, this.password);
    } else {
      await this.authService.signUp(this.email, this.password);
    }
  }

  fillDemoUser() {
    this.email = 'client@maison.com';
    this.password = 'luxury123';
  }
}
