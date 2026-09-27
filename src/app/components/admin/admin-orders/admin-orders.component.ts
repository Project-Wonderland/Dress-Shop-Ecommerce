import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="border-b border-stone-800 pb-6">
        <h1 class="font-serif text-3xl font-bold text-stone-100">Customer Purchase Orders</h1>
        <p class="mt-1 text-xs text-stone-400">Review real-time orders inserted into the Supabase database table.</p>
      </div>

      <div class="rounded-xl border border-stone-800 bg-[#121212] overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-stone-300">
            <thead class="border-b border-stone-800 bg-[#171717] text-[10px] uppercase tracking-widest text-stone-400">
              <tr>
                <th class="py-3.5 px-4">Order ID</th>
                <th class="py-3.5 px-4">User / Email</th>
                <th class="py-3.5 px-4">Selected Dress</th>
                <th class="py-3.5 px-4">Qty</th>
                <th class="py-3.5 px-4">Timestamp</th>
                <th class="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800/60">
              @if (orderService.orders().length === 0) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-stone-500 font-serif">
                    No orders logged yet. Place an order on the public storefront to test real-time recording.
                  </td>
                </tr>
              } @else {
                @for (ord of orderService.orders(); track ord.id) {
                  <tr class="hover:bg-stone-900/40 transition-colors">
                    <td class="py-3.5 px-4 font-mono font-semibold text-champagne-500">
                      {{ ord.id }}
                    </td>
                    <td class="py-3.5 px-4 text-stone-200 font-medium">
                      {{ ord.user_email || ord.user_id }}
                    </td>
                    <td class="py-3.5 px-4 flex items-center space-x-3">
                      @if (ord.dress) {
                        <img [src]="ord.dress.image_url" [alt]="ord.dress.name" class="h-10 w-8 aspect-[3/4] object-cover rounded border border-stone-800">
                        <span class="font-medium text-stone-100">{{ ord.dress.name }}</span>
                      } @else {
                        <span>Dress Ref: {{ ord.dress_id }}</span>
                      }
                    </td>
                    <td class="py-3.5 px-4 font-bold text-stone-100">
                      {{ ord.quantity }}
                    </td>
                    <td class="py-3.5 px-4 text-stone-400 text-[11px]">
                      {{ ord.created_at | date:'medium' }}
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="rounded bg-emerald-950/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-800/50">
                        Confirmed & Reserved
                      </span>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent {
  orderService = inject(OrderService);
}
