import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 bg-[#0b0b0b]">
      <div class="w-full max-w-md rounded-xl border border-champagne-600/30 bg-[#121212] p-8 shadow-2xl">

        <div class="text-center">
          <span class="rounded border border-champagne-600/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-champagne-500">
            Restricted Access
          </span>
          <h1 class="mt-3 font-serif text-3xl font-bold text-stone-100">
            Atelier Control Panel
          </h1>
          <p class="mt-2 text-xs text-stone-400">
            Sign in with administrative credentials to access inventory, orders, and product asset management.
          </p>
        </div>

        @if (authService.authError()) {
          <div class="mt-4 rounded border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
            ⚠️ {{ authService.authError() }}
          </div>
        }

        <form (ngSubmit)="onLogin()" class="mt-6 space-y-4">
          <div>
            <label class="block text-[11px] font-medium uppercase tracking-widest text-stone-300">
              Admin Email
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="admin@maison.com"
              class="mt-1.5 w-full rounded border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium uppercase tracking-widest text-stone-300">
              Secret Key / Password
            </label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••••••"
              class="mt-1.5 w-full rounded border border-stone-800 bg-stone-900 px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            [disabled]="authService.authLoading()"
            class="w-full rounded border border-champagne-600 bg-champagne-600 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all disabled:opacity-50">
            @if (authService.authLoading()) {
              <span>Verifying Admin Authorization...</span>
            } @else {
              <span>Authenticate Control Panel</span>
            }
          </button>
        </form>

        <div class="mt-6 border-t border-stone-800 pt-4 text-center">
          <button
            (click)="fillAdminDemo()"
            type="button"
            class="text-[11px] text-champagne-500 hover:underline">
            🔑 Auto-Fill Admin Demo Credentials
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';

  async onLogin() {
    if (!this.email || !this.password) return;

    const res = await this.authService.signIn(this.email, this.password);
    if (res.success) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
      this.router.navigateByUrl(returnUrl);
    }
  }

  fillAdminDemo() {
    this.email = 'admin@maison.com';
    this.password = 'admin123';
  }
}
