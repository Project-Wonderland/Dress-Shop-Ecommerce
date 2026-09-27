import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-[#0b0b0b]/90 backdrop-blur-md transition-all">
      <!-- Announcement Top Bar -->
      <div class="bg-gradient-to-r from-[#171717] via-[#262626] to-[#171717] border-b border-stone-800/50 py-1.5 text-center text-xs tracking-widest text-champagne-500 uppercase font-medium">
        <span>Complimentary Worldwide Express Courier on Orders Over $1,500</span>
      </div>

      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-3">
          <a routerLink="/" class="group flex items-center space-x-2">
            <span class="font-serif text-2xl font-bold tracking-widest text-stone-100 group-hover:text-champagne-600 transition-colors">
              MAISON ÉLÉGANCE
            </span>
            <span class="rounded border border-champagne-600/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-champagne-600">
              HAUTE COUTURE
            </span>
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-stone-300">
          <a routerLink="/" fragment="catalog" class="hover:text-champagne-600 transition-colors">Collections</a>
          <a routerLink="/" fragment="atelier" class="hover:text-champagne-600 transition-colors">Atelier</a>
          <a routerLink="/" fragment="runway" class="hover:text-champagne-600 transition-colors">Runway 2026</a>
        </nav>

        <!-- Right Side Controls (Cart, User, Admin Panel) -->
        <div class="flex items-center space-x-4">
          <!-- Admin Panel Button -->
          @if (authService.isAdmin()) {
            <a routerLink="/admin" class="flex items-center space-x-1.5 rounded-full border border-champagne-600/50 bg-champagne-600/10 px-3 py-1.5 text-xs font-medium text-champagne-600 hover:bg-champagne-600 hover:text-black transition-all">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Control Panel</span>
            </a>
          } @else {
            <a routerLink="/admin/login" class="hidden sm:inline-flex text-xs tracking-wider text-stone-400 hover:text-champagne-600 transition-colors">
              Admin Access
            </a>
          }

          <!-- User Authentication Indicator -->
          @if (authService.currentUser()) {
            <div class="relative group">
              <button class="flex items-center space-x-2 rounded-full border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 hover:border-champagne-600/50">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span class="truncate max-w-[120px]">{{ authService.currentUser()?.email || 'Client' }}</span>
              </button>
              <div class="absolute right-0 mt-1 hidden w-44 rounded-md border border-stone-800 bg-[#121212] p-1 shadow-xl group-hover:block">
                <button (click)="authService.signOut()" class="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-stone-800 rounded">
                  Sign Out
                </button>
              </div>
            </div>
          } @else {
            <button (click)="authService.triggerLazyAuth()" class="text-xs font-medium tracking-wider text-stone-300 hover:text-champagne-600 transition-colors">
              Sign In
            </button>
          }

          <!-- Shopping Bag Button -->
          <button (click)="orderService.toggleCart()" class="relative flex items-center space-x-2 rounded-full border border-stone-800 bg-stone-900 px-3.5 py-1.5 text-xs font-medium text-stone-100 hover:border-champagne-600 hover:text-champagne-600 transition-all">
            <svg class="h-4 w-4 text-champagne-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span class="hidden sm:inline">Bag</span>
            @if (orderService.cartCount() > 0) {
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-champagne-600 text-[10px] font-bold text-black animate-pulse">
                {{ orderService.cartCount() }}
              </span>
            }
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  orderService = inject(OrderService);
}
