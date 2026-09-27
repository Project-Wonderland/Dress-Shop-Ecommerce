import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (orderService.orderSuccessModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div class="relative w-full max-w-md overflow-hidden rounded-xl border border-champagne-600/40 bg-[#121212] p-8 text-center shadow-2xl animate-slide-up">

          <!-- Gold Checkmark Icon -->
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-champagne-600/50 bg-champagne-600/10 text-champagne-500 mb-4">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <span class="text-xs font-semibold uppercase tracking-widest text-champagne-600">
            Order Confirmed & Reserved
          </span>
          <h2 class="mt-1 font-serif text-2xl font-bold text-stone-100">
            Merci for Your Order
          </h2>
          <p class="mt-2 text-xs text-stone-400">
            Your haute couture dress selection has been logged into our atelier database and storage system.
          </p>

          @if (orderService.lastOrderSummary()) {
            <div class="my-6 rounded-lg border border-stone-800 bg-stone-900/60 p-4 text-left space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-stone-400">Order Reference:</span>
                <span class="font-mono text-champagne-500 font-semibold">{{ orderService.lastOrderSummary()?.orderId }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-stone-400">Total Items:</span>
                <span class="text-stone-200 font-medium">{{ orderService.lastOrderSummary()?.count }}</span>
              </div>
              <div class="flex justify-between text-xs border-t border-stone-800 pt-2">
                <span class="text-stone-400">Total Charged:</span>
                <span class="font-serif text-sm font-bold text-stone-100">\${{ orderService.lastOrderSummary()?.total | number:'1.2-2' }}</span>
              </div>
            </div>
          }

          <button
            (click)="orderService.closeOrderSuccessModal()"
            class="w-full rounded border border-champagne-600 bg-champagne-600 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all">
            Continue Shopping
          </button>
        </div>
      </div>
    }
  `
})
export class OrderSuccessModalComponent {
  orderService = inject(OrderService);
}
