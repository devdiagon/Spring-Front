import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../environments/environment';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrls.products;

  private products = signal<Product[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  constructor(private http: HttpClient, private categoryService: CategoryService) {
    this.fetchProducts();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al cargar productos';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    this.error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  fetchProducts() {
  this.loading.set(true);

  forkJoin({
    products: this.http.get<Product[]>(this.apiUrl),
    categories: this.categoryService.getCategoriesAsObservable()
    })
    .pipe(
      catchError(this.handleError.bind(this))
    )
    .subscribe({
      next: ({ products, categories }) => {
        const enriched = products.map(product => {
          const category = categories.find(c => c.id === product.categoryId);
          return {
            ...product,
            category: category ? { id: category.id, name: category.name } : undefined
          };
        });

        this.products.set(enriched);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getProducts() {
    return this.products.asReadonly();
  }

  addProduct(product: Omit<Product, 'id'>) {
    this.loading.set(true);
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (newProduct) => {
          const categories = this.categoryService.getCategories();
          const category = categories().find(c => c.id === newProduct.categoryId);
          const enrichedProduct = {
            ...newProduct,
            category: category ? { id: category.id, name: category.name } : undefined
          };


          this.products.update(products => [...products, enrichedProduct]);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  updateProduct(id: number, product: Partial<Product>) {
    this.loading.set(true);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (updatedProduct) => {
          const categories = this.categoryService.getCategories();
          const category = categories().find(c => c.id === updatedProduct.categoryId);
          const enrichedProduct = {
            ...updatedProduct,
            category: category ? { id: category.id, name: category.name } : undefined
          };

          this.products.update(products => 
            products.map(p => p.id === id ? enrichedProduct : p)
          );
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  deleteProduct(id: number) {
    this.loading.set(true);
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: () => {
          this.products.update(products => products.filter(p => p.id !== id));
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  isLoading() {
    return this.loading.asReadonly();
  }

  getError() {
    return this.error.asReadonly();
  }

  clearError() {
    this.error.set(null);
  }
}