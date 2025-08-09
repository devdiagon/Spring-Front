import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  public modalService = inject(ModalService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  formData: any = {};
  categories = this.categoryService.getCategories();
  
  constructor() {
    effect(() => {
      const data = this.modalService.modalData();
      if (this.modalService.isEditMode() && data) {
        this.formData = { ...data };
      } else {
        this.formData = {};
      }
    });
  }

  closeModal() {
    this.modalService.closeModal();
    this.formData = {};
  }

  onSubmit() {
    if (this.modalService.modalType() === 'product') {
      const productData = this.formData as Product;
      if (this.modalService.isEditMode()) {
        this.productService.updateProduct(productData.id, productData);
      } else {
        this.productService.addProduct(productData);
      }
    }
    
    if (this.modalService.modalType() === 'category') {
      const categoryData = this.formData as Category;
      if (this.modalService.isEditMode()) {
        this.categoryService.updateCategory(categoryData.id, categoryData);
      } else {
        this.categoryService.addCategory(categoryData);
      }
    }
    this.closeModal();
  }

  get title() {
    const type = this.modalService.modalType() === 'product' ? 'Producto' : 'Categoría';
    return this.modalService.isEditMode() ? `Editar ${type}` : `Agregar ${type}`;
  }
}
