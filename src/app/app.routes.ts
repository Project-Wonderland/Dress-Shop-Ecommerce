import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminInventoryComponent } from './components/admin/admin-inventory/admin-inventory.component';
import { AdminProductFormComponent } from './components/admin/admin-product-form/admin-product-form.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
    title: 'Maison Élégance — Haute Couture Collection'
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    title: 'Control Panel Access — Maison Élégance'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, title: 'Dashboard — Maison Control' },
      { path: 'inventory', component: AdminInventoryComponent, title: 'Inventory — Maison Control' },
      { path: 'products/new', component: AdminProductFormComponent, title: 'Add New Gown — Maison Control' },
      { path: 'orders', component: AdminOrdersComponent, title: 'Customer Orders — Maison Control' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
