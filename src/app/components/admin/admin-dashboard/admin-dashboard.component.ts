import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6">
        <div>
          <h1 class="font-serif text-3xl font-bold text-stone-100">Executive Dashboard</h1>
          <p class="mt-1 text-xs text-stone-400">Real-time luxury dress inventory metrics and active customer order logs.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a routerLink="/admin/products/new" class="inline-flex items-center space-x-2 rounded border border-champagne-600 bg-champagne-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all shadow-lg shadow-champagne-600/10">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Create New Gown</span>
          </a>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Card 1: Total Catalog Items -->
        <div class="rounded-xl border border-stone-800 bg-[#121212] p-6 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Total Designs</span>
            <span class="rounded bg-stone-800 p-2 text-champagne-500">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </span>
          </div>
          <div class="mt-4 font-serif text-3xl font-bold text-stone-100">
            {{ productService.dresses().length }}
          </div>
          <p class="mt-1 text-[11px] text-stone-400">Active Haute Couture pieces</p>
        </div>

        <!-- Card 2: Inventory Stock Level -->
        <div class="rounded-xl border border-stone-800 bg-[#121212] p-6 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Total Units</span>
            <span class="rounded bg-stone-800 p-2 text-emerald-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          </div>
          <div class="mt-4 font-serif text-3xl font-bold text-stone-100">
            {{ totalStockUnits() }}
          </div>
          <p class="mt-1 text-[11px] text-stone-400">Physical pieces available in atelier</p>
        </div>

        <!-- Card 3: Total Portfolio Valuation -->
        <div class="rounded-xl border border-stone-800 bg-[#121212] p-6 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Inventory Value</span>
            <span class="rounded bg-stone-800 p-2 text-champagne-500">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
          </div>
          <div class="mt-4 font-serif text-3xl font-bold text-champagne-500">
            \${{ totalInventoryValue() | number:'1.2-2' }}
          </div>
          <p class="mt-1 text-[11px] text-stone-400">Retail valuation of stock</p>
        </div>

        <!-- Card 4: Orders Logged -->
        <div class="rounded-xl border border-stone-800 bg-[#121212] p-6 shadow-xl">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Orders Logged</span>
            <span class="rounded bg-stone-800 p-2 text-purple-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </span>
          </div>
          <div class="mt-4 font-serif text-3xl font-bold text-stone-100">
            {{ orderService.orders().length }}
          </div>
          <p class="mt-1 text-[11px] text-stone-400">Logged via Supabase tables</p>
        </div>
      </div>

      <!-- Recent Inventory Preview Table -->
      <div class="rounded-xl border border-stone-800 bg-[#121212] p-6 shadow-xl">
        <div class="flex items-center justify-between border-b border-stone-800 pb-4">
          <h3 class="font-serif text-lg font-bold text-stone-100">Recent Atelier Additions</h3>
          <a routerLink="/admin/inventory" class="text-xs text-champagne-500 hover:underline uppercase tracking-wider">
            View All Inventory →
          </a>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-xs text-stone-300">
            <thead class="border-b border-stone-800 text-[10px] uppercase tracking-widest text-stone-500">
              <tr>
                <th class="py-3 px-4">Gown</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Price</th>
                <th class="py-3 px-4">Stock</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800/60">
              @for (dress of productService.dresses().slice(0, 5); track dress.id) {
                <tr class="hover:bg-stone-900/40 transition-colors">
                  <td class="py-3 px-4 flex items-center space-x-3">
                    <img [src]="dress.image_url" [alt]="dress.name" class="h-10 w-8 aspect-[3/4] object-cover rounded border border-stone-800">
                    <span class="font-medium text-stone-100">{{ dress.name }}</span>
                  </td>
                  <td class="py-3 px-4 text-champagne-500 font-medium">{{ dress.type }}</td>
                  <td class="py-3 px-4 font-bold text-stone-200">\${{ dress.price | number:'1.2-2' }}</td>
                  <td class="py-3 px-4">
                    <span [class.text-rose-400]="dress.stock <= 3" [class.text-emerald-400]="dress.stock > 3">
                      {{ dress.stock }} units
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  productService = inject(ProductService);
  orderService = inject(OrderService);

  totalStockUnits = computed(() =>
    this.productService.dresses().reduce((sum, item) => sum + item.stock, 0)
  );

  totalInventoryValue = computed(() =>
    this.productService.dresses().reduce((sum, item) => sum + (item.price * item.stock), 0)
  );
}
