import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { PanelProduct } from './components/panel-product/panel-product';
import { PanelCategory } from './components/panel-category/panel-category';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: PanelProduct },
  { path: 'categories', component: PanelCategory },
  { path: '**', redirectTo: '' }
];
