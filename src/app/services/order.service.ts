import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { SupabaseService } from './supabase.service';
import { CartItem, Order } from '../models/order.model';
import { Dress } from '../models/dress.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private supabaseService = inject(SupabaseService);

  // Cart Signals
  cartItems = signal<CartItem[]>([]);
  isCartOpen = signal<boolean>(false);

  // Computed Cart Summaries
  cartTotal = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.dress.price * item.quantity), 0)
  );

  cartCount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  // Order History Signals
  orders = signal<Order[]>([]);
  orderSuccessModalOpen = signal<boolean>(false);
  lastOrderSummary = signal<{ orderId: string; total: number; count: number } | null>(null);

  addToCart(dress: Dress, quantity: number = 1, selectedSize: string = 'FR 38') {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(i => i.dress.id === dress.id && i.selectedSize === selectedSize);
      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...items, { dress, quantity, selectedSize }];
    });
    this.isCartOpen.set(true);
  }

  removeFromCart(dressId: string) {
    this.cartItems.update(items => items.filter(item => item.dress.id !== dressId));
  }

  updateQuantity(dressId: string, qty: number) {
    if (qty <= 0) {
      this.removeFromCart(dressId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item => item.dress.id === dressId ? { ...item, quantity: qty } : item)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
  }

  /**
   * Lazy Auth Checkout Flow:
   * Checks if user is authenticated via AuthService.
   * If authenticated -> places order directly.
   * If guest -> triggers Lazy Auth Modal. Upon successful login/signup,
   * callback executes `executeOrderPlacement()` seamlessly without state loss!
   */
  checkout() {
    if (this.cartItems().length === 0) return;

    this.authService.triggerLazyAuth(() => {
      this.executeOrderPlacement();
    });
  }

  private async executeOrderPlacement() {
    const items = this.cartItems();
    if (items.length === 0) return;

    const user = this.authService.currentUser();
    const userId = user?.id || 'guest-user-' + Date.now();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = this.cartTotal();
    const totalCount = this.cartCount();

    // Insert records into public.orders in Supabase
    if (user && !this.supabaseService.isMockMode) {
      for (const item of items) {
        try {
          await this.supabaseService.client
            .from('orders')
            .insert({
              user_id: user.id,
              dress_id: item.dress.id,
              quantity: item.quantity
            });

          // Update stock in dresses table
          const remainingStock = Math.max(0, item.dress.stock - item.quantity);
          await this.productService.updateStock(item.dress.id, remainingStock);
        } catch (err) {
          console.warn('Order insert notice:', err);
        }
      }
    } else {
      // Mock mode stock reduction
      for (const item of items) {
        const remainingStock = Math.max(0, item.dress.stock - item.quantity);
        this.productService.updateStock(item.dress.id, remainingStock);
      }
    }

    const newOrderRecord: Order = {
      id: orderId,
      user_id: userId,
      dress_id: items[0].dress.id,
      quantity: totalCount,
      created_at: new Date().toISOString(),
      dress: items[0].dress,
      user_email: user?.email || 'authenticated.guest@maison.com'
    };

    this.orders.update(prev => [newOrderRecord, ...prev]);
    this.lastOrderSummary.set({
      orderId,
      total: totalAmount,
      count: totalCount
    });

    this.clearCart();
    this.isCartOpen.set(false);
    this.orderSuccessModalOpen.set(true);
  }

  closeOrderSuccessModal() {
    this.orderSuccessModalOpen.set(false);
    this.lastOrderSummary.set(null);
  }
}
