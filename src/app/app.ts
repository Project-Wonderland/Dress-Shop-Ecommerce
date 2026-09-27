import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { LazyAuthModalComponent } from './components/lazy-auth-modal/lazy-auth-modal.component';
import { OrderSuccessModalComponent } from './components/order-success-modal/order-success-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    CartDrawerComponent,
    LazyAuthModalComponent,
    OrderSuccessModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);

  // Hide main public header on /admin/* pages for a dedicated clean admin dashboard view
  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
