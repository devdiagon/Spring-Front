import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrls.categories;

  private categories = signal<Category[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.fetchCategories();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al cargar categorías';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    this.error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  fetchCategories() {
    this.loading.set(true);
    this.http.get<Category[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (data) => {
          this.categories.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  getCategories() {
    return this.categories.asReadonly();
  }

  getCategoriesAsObservable(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>) {
    this.loading.set(true);
    return this.http.post<Category>(this.apiUrl, category)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (newCategory) => {
          this.categories.update(categories => [...categories, newCategory]);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  updateCategory(id: number, category: Partial<Category>) {
    this.loading.set(true);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update(categories => 
            categories.map(c => c.id === id ? updatedCategory : c)
          );
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  deleteCategory(id: number) {
    this.loading.set(true);
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe({
        next: () => {
          this.categories.update(categories => categories.filter(c => c.id !== id));
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