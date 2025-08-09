import { Component, inject, signal } from '@angular/core';
import { Table } from '../table/table';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-panel-product',
  imports: [Table, RouterModule, CommonModule],
  templateUrl: './panel-product.html',
  styleUrl: './panel-product.css'
})
export class PanelProduct {
  private productService = inject(ProductService);
  private modalService = inject(ModalService);

  products = this.productService.getProducts();

  headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Categoría', 'Acción'];

  openAddModal() {
    this.modalService.openModal('product');
  }

  openEditModal(product: Product) {
    this.modalService.openModal('product', product, true);
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id);
    }
  }
}
