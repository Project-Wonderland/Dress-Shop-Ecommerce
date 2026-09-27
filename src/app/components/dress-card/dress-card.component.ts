import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dress } from '../../models/dress.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dress-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative flex flex-col overflow-hidden rounded-lg border border-stone-800/80 bg-obsidian-850 transition-all duration-300 hover:border-champagne-600/40 hover:shadow-2xl hover:shadow-champagne-600/10">

      <!-- High Fashion Image Container (3:4 aspect ratio) -->
      <div class="relative w-full aspect-[3/4] overflow-hidden bg-stone-900 cursor-pointer" (click)="onQuickView.emit(dress)">
        <img
          [src]="dress.image_url"
          [alt]="dress.name"
          class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <!-- Stock Status Badge -->
        <div class="absolute top-3 left-3 z-10">
          @if (dress.stock <= 0) {
            <span class="rounded bg-rose-950/80 px-2 py-1 text-[10px] font-semibold tracking-wider text-rose-300 backdrop-blur-md uppercase border border-rose-800/50">
              Sold Out
            </span>
          } @else if (dress.stock <= 3) {
            <span class="rounded bg-amber-950/80 px-2 py-1 text-[10px] font-semibold tracking-wider text-amber-300 backdrop-blur-md uppercase border border-amber-700/50">
              Only {{ dress.stock }} Left
            </span>
          } @else {
            <span class="rounded bg-black/60 px-2 py-1 text-[10px] font-medium tracking-widest text-stone-300 backdrop-blur-md uppercase border border-stone-700/50">
              Limited Edition
            </span>
          }
        </div>

        <!-- Quick View Hover Overlay Button -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button (click)="$event.stopPropagation(); onQuickView.emit(dress)" class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-black hover:bg-champagne-600 hover:text-black">
            Quick View
          </button>
        </div>
      </div>

      <!-- Content Info -->
      <div class="flex flex-1 flex-col justify-between p-4">
        <div>
          <span class="text-[11px] font-medium uppercase tracking-widest text-champagne-500">
            {{ dress.type }}
          </span>
          <h3 class="mt-1 font-serif text-lg font-semibold tracking-wide text-stone-100 group-hover:text-champagne-600 transition-colors line-clamp-1">
            {{ dress.name }}
          </h3>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-stone-800/60 pt-3">
          <div>
            <span class="text-xs text-stone-400">Price</span>
            <div class="font-serif text-lg font-bold text-stone-100">
              \${{ dress.price | number:'1.2-2' }}
            </div>
          </div>

          <!-- Add to Bag Button -->
          <button
            (click)="onAddToBag(dress)"
            [disabled]="dress.stock <= 0"
            class="flex items-center space-x-1.5 rounded border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-medium tracking-wider text-stone-200 hover:border-champagne-600 hover:bg-champagne-600 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DressCardComponent {
  @Input({ required: true }) dress!: Dress;
  @Output() onQuickView = new EventEmitter<Dress>();

  orderService = inject(OrderService);

  onAddToBag(dress: Dress) {
    this.orderService.addToCart(dress);
  }
}
