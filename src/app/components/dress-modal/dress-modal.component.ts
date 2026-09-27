import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dress } from '../../models/dress.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dress-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dress) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div class="relative w-full max-w-4xl overflow-hidden rounded-xl border border-stone-800 bg-[#121212] shadow-2xl">
          <!-- Close Button -->
          <button (click)="onClose.emit()" class="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-stone-400 hover:text-stone-100 hover:bg-black/90 transition-all">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Product Image -->
            <div class="relative aspect-[3/4] bg-stone-900 overflow-hidden">
              <img [src]="dress.image_url" [alt]="dress.name" class="h-full w-full object-cover">
            </div>

            <!-- Product Details & Size Selector -->
            <div class="flex flex-col justify-between p-6 md:p-8">
              <div>
                <span class="text-xs font-semibold tracking-widest uppercase text-champagne-600">
                  {{ dress.type }}
                </span>
                <h2 class="mt-2 font-serif text-3xl font-bold text-stone-100">
                  {{ dress.name }}
                </h2>
                <div class="mt-3 font-serif text-2xl font-semibold text-champagne-500">
                  \${{ dress.price | number:'1.2-2' }}
                </div>

                <p class="mt-4 text-xs leading-relaxed text-stone-400">
                  Crafted by master artisans in Paris using pure mulberry silk and hand-sewn embellishments. Designed for uncompromised elegance at high-society galas and premier evening events.
                </p>

                <!-- Size Selection -->
                <div class="mt-6">
                  <label class="block text-xs font-medium uppercase tracking-widest text-stone-300">
                    French Size (EU)
                  </label>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    @for (size of sizes; track size) {
                      <button
                        (click)="selectedSize.set(size)"
                        [class.border-champagne-600]="selectedSize() === size"
                        [class.bg-champagne-600]="selectedSize() === size"
                        [class.text-black]="selectedSize() === size"
                        [class.text-stone-300]="selectedSize() !== size"
                        class="rounded border border-stone-800 py-2 text-xs font-semibold transition-all hover:border-stone-600">
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Stock info -->
                <div class="mt-6 flex items-center space-x-2 text-xs text-stone-400">
                  <span class="h-2 w-2 rounded-full" [class.bg-emerald-500]="dress.stock > 0" [class.bg-rose-500]="dress.stock <= 0"></span>
                  <span>{{ dress.stock > 0 ? ('In Stock (' + dress.stock + ' available)') : 'Currently Out of Stock' }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 pt-6 border-t border-stone-800 flex space-x-4">
                <button
                  (click)="addToBag()"
                  [disabled]="dress.stock <= 0"
                  class="flex-1 rounded border border-champagne-600 bg-champagne-600 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all disabled:opacity-50">
                  Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DressModalComponent {
  @Input() dress: Dress | null = null;
  @Output() onClose = new EventEmitter<void>();

  orderService = inject(OrderService);

  sizes = ['FR 34', 'FR 36', 'FR 38', 'FR 40'];
  selectedSize = signal<string>('FR 38');

  addToBag() {
    if (this.dress) {
      this.orderService.addToCart(this.dress, 1, this.selectedSize());
      this.onClose.emit();
    }
  }
}
