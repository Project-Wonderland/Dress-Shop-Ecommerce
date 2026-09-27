import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Top Title & Add Button -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-6">
        <div>
          <h1 class="font-serif text-3xl font-bold text-stone-100">Atelier Dress Inventory</h1>
          <p class="mt-1 text-xs text-stone-400">Manage stock quantities, prices, and high-fashion catalog assets.</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <a routerLink="/admin/products/new" class="inline-flex items-center space-x-2 rounded border border-champagne-600 bg-champagne-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add New Gown</span>
          </a>
        </div>
      </div>

      <!-- Inventory Table Box -->
      <div class="rounded-xl border border-stone-800 bg-[#121212] overflow-hidden shadow-2xl">
        <div class="p-4 border-b border-stone-800 flex justify-between items-center bg-[#171717]/60">
          <span class="text-xs font-semibold uppercase tracking-wider text-stone-300">
            Total Designs: {{ productService.dresses().length }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-stone-300">
            <thead class="border-b border-stone-800 bg-[#171717] text-[10px] uppercase tracking-widest text-stone-400">
              <tr>
                <th class="py-3.5 px-4">Preview</th>
                <th class="py-3.5 px-4">Dress Name</th>
                <th class="py-3.5 px-4">Category / Silhouette</th>
                <th class="py-3.5 px-4">Price</th>
                <th class="py-3.5 px-4">Current Stock</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800/60">
              @for (dress of productService.dresses(); track dress.id) {
                <tr class="hover:bg-stone-900/40 transition-colors">
                  <!-- Thumbnail -->
                  <td class="py-3 px-4">
                    <div class="h-14 w-10 aspect-[3/4] overflow-hidden rounded bg-stone-900 border border-stone-800">
                      <img [src]="dress.image_url" [alt]="dress.name" class="h-full w-full object-cover">
                    </div>
                  </td>

                  <!-- Dress Name -->
                  <td class="py-3 px-4 font-serif text-sm font-semibold text-stone-100">
                    {{ dress.name }}
                  </td>

                  <!-- Category -->
                  <td class="py-3 px-4">
                    <span class="inline-block rounded-full border border-champagne-600/30 bg-champagne-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-champagne-500">
                      {{ dress.type }}
                    </span>
                  </td>

                  <!-- Price -->
                  <td class="py-3 px-4 font-serif text-sm font-bold text-stone-200">
                    \${{ dress.price | number:'1.2-2' }}
                  </td>

                  <!-- Stock Adjustment Controls -->
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2">
                      <button (click)="updateStock(dress.id, dress.stock - 1)" class="rounded border border-stone-800 bg-stone-900 px-2 py-1 text-stone-300 hover:border-stone-600 font-bold">-</button>
                      <span [class.text-rose-400]="dress.stock <= 3" [class.text-emerald-400]="dress.stock > 3" class="w-8 text-center font-bold">
                        {{ dress.stock }}
                      </span>
                      <button (click)="updateStock(dress.id, dress.stock + 1)" class="rounded border border-stone-800 bg-stone-900 px-2 py-1 text-stone-300 hover:border-stone-600 font-bold">+</button>
                    </div>
                  </td>

                  <!-- Delete Action -->
                  <td class="py-3 px-4 text-right">
                    <button
                      (click)="confirmDelete(dress.id, dress.name)"
                      class="rounded border border-rose-900/40 bg-rose-950/20 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/60 transition-colors">
                      Delete
                    </button>
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
export class AdminInventoryComponent {
  productService = inject(ProductService);

  updateStock(id: string, newStock: number) {
    if (newStock < 0) return;
    this.productService.updateStock(id, newStock);
  }

  confirmDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      this.productService.deleteDress(id);
    }
  }
}
