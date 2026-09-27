import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { DressCardComponent } from '../dress-card/dress-card.component';
import { DressModalComponent } from '../dress-modal/dress-modal.component';
import { Dress, DressCategory } from '../../models/dress.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DressCardComponent, DressModalComponent],
  template: `
    <main class="w-full pb-24">
      <!-- Luxury Hero Banner -->
      <section class="relative h-[65vh] min-h-[480px] w-full overflow-hidden bg-stone-950 flex items-center justify-center">
        <!-- Background Hero Image with Dark Overlay -->
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
          alt="Maison Elegance Haute Couture"
          class="absolute inset-0 h-full w-full object-cover object-center opacity-40 filter brightness-75 scale-105 animate-pulse-slow"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/40 to-transparent"></div>

        <div class="relative z-10 max-w-4xl text-center px-4">
          <span class="font-serif text-xs font-semibold tracking-widest uppercase text-champagne-500">
            Savoir-Faire & Timeless Artistry
          </span>
          <h1 class="mt-3 font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-wide text-stone-100">
            The Haute Couture Collection
          </h1>
          <p class="mt-4 max-w-2xl mx-auto text-xs sm:text-sm font-light leading-relaxed text-stone-300">
            Impeccably tailored evening gowns, liquid silk slips, and avant-garde runway silhouettes crafted for unforgettable moments of luxury.
          </p>

          <div class="mt-8 flex justify-center space-x-4">
            <a href="#catalog" class="rounded border border-champagne-600 bg-champagne-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all">
              Discover Catalog
            </a>
          </div>
        </div>
      </section>

      <!-- Catalog Section Container -->
      <section id="catalog" class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        
        <!-- Header Controls (Categories, Search, Sort) -->
        <div class="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-stone-800/80 pb-6">
          
          <!-- Category Pills -->
          <div class="flex flex-wrap gap-2">
            @for (cat of categories; track cat) {
              <button
                (click)="productService.selectedCategory.set(cat)"
                [class.bg-champagne-600]="productService.selectedCategory() === cat"
                [class.text-black]="productService.selectedCategory() === cat"
                [class.border-champagne-600]="productService.selectedCategory() === cat"
                [class.text-stone-300]="productService.selectedCategory() !== cat"
                class="rounded-full border border-stone-800 bg-stone-900/80 px-4 py-1.5 text-xs font-medium tracking-wider transition-all hover:border-champagne-600/50">
                {{ cat }}
              </button>
            }
          </div>

          <!-- Search & Sort Controls -->
          <div class="flex items-center space-x-3">
            <!-- Search Bar -->
            <div class="relative flex-1 sm:w-64">
              <input
                type="text"
                [ngModel]="productService.searchQuery()"
                (ngModelChange)="productService.searchQuery.set($event)"
                placeholder="Search gowns..."
                class="w-full rounded-full border border-stone-800 bg-stone-900/90 py-2 pl-9 pr-4 text-xs text-stone-100 placeholder-stone-500 focus:border-champagne-600 focus:outline-none focus:ring-1 focus:ring-champagne-600"
              />
              <svg class="absolute left-3 top-2.5 h-4 w-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Sort Dropdown -->
            <select
              [ngModel]="productService.sortBy()"
              (ngModelChange)="productService.sortBy.set($event)"
              class="rounded-full border border-stone-800 bg-stone-900/90 py-2 px-3 text-xs text-stone-300 focus:border-champagne-600 focus:outline-none">
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="mt-8">
          @if (productService.loading()) {
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="aspect-[3/4] rounded-lg bg-stone-900/60 animate-pulse border border-stone-800"></div>
              }
            </div>
          } @else if (productService.filteredDresses().length === 0) {
            <div class="py-24 text-center">
              <p class="font-serif text-xl text-stone-400">No dresses found matching your selection.</p>
              <button (click)="resetFilters()" class="mt-4 text-xs font-semibold uppercase tracking-widest text-champagne-500 hover:underline">
                Clear Filters
              </button>
            </div>
          } @else {
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              @for (dress of productService.filteredDresses(); track dress.id) {
                <app-dress-card
                  [dress]="dress"
                  (onQuickView)="quickViewDress.set($event)"
                ></app-dress-card>
              }
            </div>
          }
        </div>
      </section>

      <!-- Quick View Modal Component -->
      <app-dress-modal
        [dress]="quickViewDress()"
        (onClose)="quickViewDress.set(null)"
      ></app-dress-modal>
    </main>
  `
})
export class CatalogComponent {
  productService = inject(ProductService);

  categories: DressCategory[] = ['All', 'Haute Couture', 'Evening Gown', 'Silk Slip', 'Cocktail', 'Runway'];
  quickViewDress = signal<Dress | null>(null);

  resetFilters() {
    this.productService.selectedCategory.set('All');
    this.productService.searchQuery.set('');
    this.productService.sortBy.set('featured');
  }
}
