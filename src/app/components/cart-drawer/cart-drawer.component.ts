import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (orderService.isCartOpen()) {
      <!-- Backdrop Overlay -->
      <div (click)="orderService.toggleCart()" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in"></div>

      <!-- Slide-over Drawer Panel -->
      <div class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#121212] border-l border-stone-800 shadow-2xl animate-slide-up">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-800 p-6">
          <div class="flex items-center space-x-3">
            <h2 class="font-serif text-xl font-bold tracking-wide text-stone-100">Shopping Bag</h2>
            <span class="rounded-full bg-stone-800 px-2.5 py-0.5 text-xs font-semibold text-champagne-500">
              {{ orderService.cartCount() }} {{ orderService.cartCount() === 1 ? 'item' : 'items' }}
            </span>
          </div>
          <button (click)="orderService.toggleCart()" class="rounded-full p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          @if (orderService.cartItems().length === 0) {
            <div class="flex flex-col items-center justify-center h-64 text-center">
              <svg class="h-12 w-12 text-stone-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <p class="text-sm text-stone-400 font-serif">Your shopping bag is currently empty.</p>
              <button (click)="orderService.toggleCart()" class="mt-4 text-xs font-semibold text-champagne-600 hover:underline uppercase tracking-wider">
                Explore Haute Couture
              </button>
            </div>
          } @else {
            @for (item of orderService.cartItems(); track item.dress.id + item.selectedSize) {
              <div class="flex space-x-4 border-b border-stone-800/60 pb-6">
                <!-- Thumbnail (3:4 aspect) -->
                <div class="h-24 w-18 flex-shrink-0 aspect-[3/4] overflow-hidden rounded bg-stone-900 border border-stone-800">
                  <img [src]="item.dress.image_url" [alt]="item.dress.name" class="h-full w-full object-cover">
                </div>

                <!-- Info -->
                <div class="flex flex-1 flex-col justify-between">
                  <div>
                    <div class="flex justify-between">
                      <h4 class="font-serif text-sm font-semibold text-stone-100 line-clamp-1">
                        {{ item.dress.name }}
                      </h4>
                      <button (click)="orderService.removeFromCart(item.dress.id)" class="text-stone-500 hover:text-rose-400 transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    <p class="text-[11px] text-champagne-600 mt-0.5">{{ item.dress.type }} • {{ item.selectedSize }}</p>
                  </div>

                  <div class="flex items-center justify-between mt-2">
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2 rounded border border-stone-800 bg-stone-900 px-2 py-1">
                      <button (click)="orderService.updateQuantity(item.dress.id, item.quantity - 1)" class="text-stone-400 hover:text-stone-100 text-xs px-1 font-bold">-</button>
                      <span class="text-xs text-stone-200 font-semibold px-2">{{ item.quantity }}</span>
                      <button (click)="orderService.updateQuantity(item.dress.id, item.quantity + 1)" class="text-stone-400 hover:text-stone-100 text-xs px-1 font-bold">+</button>
                    </div>

                    <div class="font-serif text-sm font-bold text-stone-100">
                      \${{ (item.dress.price * item.quantity) | number:'1.2-2' }}
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer Summary & Checkout -->
        @if (orderService.cartItems().length > 0) {
          <div class="border-t border-stone-800 bg-[#0e0e0e] p-6 space-y-4">
            <div class="flex justify-between text-xs text-stone-400">
              <span>Subtotal</span>
              <span class="text-stone-200 font-semibold">\${{ orderService.cartTotal() | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between text-xs text-stone-400">
              <span>Express Delivery</span>
              <span class="text-emerald-400 font-medium">Complimentary</span>
            </div>
            <div class="flex justify-between border-t border-stone-800 pt-3 text-base font-serif font-bold text-stone-100">
              <span>Estimated Total</span>
              <span class="text-champagne-500">\${{ orderService.cartTotal() | number:'1.2-2' }}</span>
            </div>

            <button
              (click)="orderService.checkout()"
              class="w-full rounded border border-champagne-600 bg-champagne-600 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all shadow-lg shadow-champagne-600/10">
              Proceed to Checkout
            </button>

            <p class="text-[10px] text-center text-stone-500">
              🔒 Encrypted 256-bit SSL Checkout & Direct Supabase Security
            </p>
          </div>
        }
      </div>
    }
  `
})
export class CartDrawerComponent {
  orderService = inject(OrderService);
}
