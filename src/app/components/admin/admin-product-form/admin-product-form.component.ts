import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Title -->
      <div class="border-b border-stone-800 pb-6">
        <h1 class="font-serif text-3xl font-bold text-stone-100">Create New Haute Couture Gown</h1>
        <p class="mt-1 text-xs text-stone-400">
          Upload dress photography and configure atelier catalog specifications with conflict-proof asset storage.
        </p>
      </div>

      <!-- Success Notification -->
      @if (successMessage()) {
        <div class="rounded-lg border border-emerald-600/40 bg-emerald-950/40 p-4 text-xs text-emerald-300">
          ✓ {{ successMessage() }}
        </div>
      }

      <!-- Error Notification -->
      @if (errorMessage()) {
        <div class="rounded-lg border border-rose-600/40 bg-rose-950/40 p-4 text-xs text-rose-300">
          ⚠️ {{ errorMessage() }}
        </div>
      }

      <!-- Form Card -->
      <div class="rounded-xl border border-stone-800 bg-[#121212] p-8 shadow-2xl">
        <form [formGroup]="dressForm" (ngSubmit)="onSubmit()" class="space-y-6">

          <!-- Dress Name -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-widest text-stone-300">
              Dress Name <span class="text-champagne-600">*</span>
            </label>
            <input
              type="text"
              formControlName="name"
              placeholder="e.g. Aurelia Gold Silk Evening Gown"
              class="mt-2 w-full rounded border border-stone-800 bg-stone-900 px-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none"
            />
            @if (dressForm.get('name')?.touched && dressForm.get('name')?.invalid) {
              <p class="mt-1 text-[11px] text-rose-400">Dress name is required.</p>
            }
          </div>

          <!-- Type / Category Dropdown -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-widest text-stone-300">
              Category / Silhouette <span class="text-champagne-600">*</span>
            </label>
            <select
              formControlName="type"
              class="mt-2 w-full rounded border border-stone-800 bg-stone-900 px-4 py-3 text-xs text-stone-100 focus:border-champagne-600 focus:outline-none">
              <option value="Haute Couture">Haute Couture</option>
              <option value="Evening Gown">Evening Gown</option>
              <option value="Silk Slip">Silk Slip</option>
              <option value="Cocktail">Cocktail</option>
              <option value="Runway">Runway</option>
            </select>
          </div>

          <!-- Price & Stock Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-widest text-stone-300">
                Retail Price ($ USD) <span class="text-champagne-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                formControlName="price"
                placeholder="2450.00"
                class="mt-2 w-full rounded border border-stone-800 bg-stone-900 px-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none"
              />
              @if (dressForm.get('price')?.touched && dressForm.get('price')?.invalid) {
                <p class="mt-1 text-[11px] text-rose-400">Valid price greater than 0 is required.</p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-widest text-stone-300">
                Initial Stock Quantity <span class="text-champagne-600">*</span>
              </label>
              <input
                type="number"
                formControlName="stock"
                placeholder="5"
                class="mt-2 w-full rounded border border-stone-800 bg-stone-900 px-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:border-champagne-600 focus:outline-none"
              />
              @if (dressForm.get('stock')?.touched && dressForm.get('stock')?.invalid) {
                <p class="mt-1 text-[11px] text-rose-400">Stock quantity is required.</p>
              }
            </div>
          </div>

          <!-- Conflict-Free Image File Upload & Preview -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-widest text-stone-300">
              High-Fashion Asset Photography <span class="text-champagne-600">*</span>
            </label>
            <p class="text-[11px] text-stone-500 mt-0.5">
              Files are processed through conflict-proof UUID prefixing before upload to the <code class="text-champagne-600">dress-images</code> Supabase bucket.
            </p>

            <div class="mt-3 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border-2 border-dashed border-stone-800 rounded-lg p-6 bg-stone-900/40 hover:border-champagne-600/50 transition-colors">
              <!-- Preview Thumb (3:4 aspect) -->
              <div class="h-32 w-24 flex-shrink-0 aspect-[3/4] overflow-hidden rounded bg-stone-950 border border-stone-800 flex items-center justify-center">
                @if (imagePreviewUrl()) {
                  <img [src]="imagePreviewUrl()" alt="Preview" class="h-full w-full object-cover">
                } @else {
                  <span class="text-[10px] text-stone-600 text-center px-2">No Photo Selected</span>
                }
              </div>

              <!-- Upload Input Button -->
              <div class="flex-1 text-center sm:text-left">
                <input
                  type="file"
                  #fileInput
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  class="hidden"
                />
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="rounded border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:border-champagne-600 hover:text-champagne-500 transition-all">
                  Select Photo File
                </button>
                @if (selectedFile()) {
                  <p class="mt-2 text-xs font-mono text-champagne-500 truncate max-w-xs">
                    File: {{ selectedFile()?.name }}
                  </p>
                }
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-stone-800 flex justify-end space-x-4">
            <button
              type="button"
              (click)="router.navigate(['/admin/inventory'])"
              class="rounded border border-stone-800 bg-stone-900 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-200 transition-colors">
              Cancel
            </button>

            <button
              type="submit"
              [disabled]="dressForm.invalid || isSubmitting()"
              class="rounded border border-champagne-600 bg-champagne-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-champagne-500 transition-all disabled:opacity-50">
              @if (isSubmitting()) {
                <span>Uploading & Registering...</span>
              } @else {
                <span>Publish Gown to Atelier</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  router = inject(Router);

  dressForm = this.fb.group({
    name: ['', Validators.required],
    type: ['Evening Gown', Validators.required],
    price: [1890, [Validators.required, Validators.min(0.01)]],
    stock: [5, [Validators.required, Validators.min(0)]],
  });

  selectedFile = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.dressForm.invalid) return;

    this.isSubmitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const formValue = this.dressForm.value;
    const file = this.selectedFile();
    const preview = this.imagePreviewUrl() || undefined;

    const res = await this.productService.createDress(
      {
        name: formValue.name!,
        type: formValue.type!,
        price: formValue.price!,
        stock: formValue.stock!
      },
      file,
      preview
    );

    this.isSubmitting.set(false);

    if (res.success) {
      this.successMessage.set(`Successfully created "${formValue.name}" with conflict-proof file storage!`);
      setTimeout(() => {
        this.router.navigate(['/admin/inventory']);
      }, 1200);
    } else {
      this.errorMessage.set(res.error || 'Failed to register product');
    }
  }
}
