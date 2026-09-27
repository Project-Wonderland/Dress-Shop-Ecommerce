import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#0b0b0b] text-stone-100 flex flex-col md:flex-row">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-800 bg-[#121212] flex flex-col justify-between p-6">
        <div>
          <!-- Admin Title -->
          <div class="pb-6 border-b border-stone-800">
            <a routerLink="/" class="block">
              <span class="font-serif text-xl font-bold tracking-widest text-stone-100">MAISON</span>
              <span class="block text-[10px] uppercase font-semibold tracking-widest text-champagne-600">ATELIER CONTROL PANEL</span>
            </a>
          </div>

          <!-- Navigation Menu -->
          <nav class="mt-6 space-y-1">
            <a
              routerLink="/admin/dashboard"
              routerLinkActive="bg-stone-800 text-champagne-500 border-l-2 border-champagne-600"
              class="flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 rounded-r transition-all">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Dashboard</span>
            </a>

            <a
              routerLink="/admin/inventory"
              routerLinkActive="bg-stone-800 text-champagne-500 border-l-2 border-champagne-600"
              class="flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 rounded-r transition-all">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span>Dress Inventory</span>
            </a>

            <a
              routerLink="/admin/products/new"
              routerLinkActive="bg-stone-800 text-champagne-500 border-l-2 border-champagne-600"
              class="flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 rounded-r transition-all">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Add New Gown</span>
            </a>

            <a
              routerLink="/admin/orders"
              routerLinkActive="bg-stone-800 text-champagne-500 border-l-2 border-champagne-600"
              class="flex items-center space-x-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 rounded-r transition-all">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Customer Orders</span>
            </a>
          </nav>
        </div>

        <!-- Admin Profile & Return to Storefront -->
        <div class="mt-8 pt-6 border-t border-stone-800 space-y-3">
          <a routerLink="/" class="block w-full text-center rounded border border-stone-800 bg-stone-900 py-2 text-xs font-medium text-stone-300 hover:border-stone-600 transition-colors">
            ← Public Storefront
          </a>
          <button (click)="onSignOut()" class="block w-full text-center rounded border border-rose-900/40 bg-rose-950/20 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors">
            Sign Out Admin
          </button>
        </div>
      </aside>

      <!-- Main Content View Area -->
      <main class="flex-1 p-6 md:p-10 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  onSignOut() {
    this.authService.signOut();
  }
}
