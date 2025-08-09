import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Table } from '../table/table';
import { ModalService } from '../../services/modal.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-panel-category',
  imports: [CommonModule, RouterModule, Table, DatePipe],
  templateUrl: './panel-category.html',
  styleUrl: './panel-category.css'
})
export class PanelCategory {
  private categoryService = inject(CategoryService);
  private modalService = inject(ModalService);

  categories = this.categoryService.getCategories();

  headers = ['ID', 'Nombre', 'Descripción', 'Fecha Creación', 'Acción'];

  openAddModal() {
    this.modalService.openModal('category');
  }

  openEditModal(category: Category) {
    this.modalService.openModal('category', category, true);
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id);
    }
  }
}
