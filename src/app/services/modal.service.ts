import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

type ModalType = 'product' | 'category';
type ModalData = Partial<Product> | Partial<Category>;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isOpen = signal(false);
  modalType = signal<ModalType | null>(null);
  modalData = signal<ModalData | null>(null);
  isEditMode = signal(false);

  openModal(type: ModalType, data: ModalData | null = null, isEdit: boolean = false) {
    this.modalType.set(type);
    this.modalData.set(data);
    this.isEditMode.set(isEdit);
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
    this.modalType.set(null);
    this.modalData.set(null);
    this.isEditMode.set(false);
  }
}