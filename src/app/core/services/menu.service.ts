import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuCategory, MenuItem, WineItem } from '../models/menu.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  getCategories(): Observable<MenuCategory[]> { return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`); }
  addCategory(category: Omit<MenuCategory, 'id'>): Observable<MenuCategory> { return this.http.post<MenuCategory>(`${this.apiUrl}/categories`, category); }
  updateCategory(id: string, category: Partial<MenuCategory>): Observable<MenuCategory> { return this.http.put<MenuCategory>(`${this.apiUrl}/categories/${id}`, category); }
  deleteCategory(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/categories/${id}`); }
  getItems(categoryId?: string): Observable<MenuItem[]> { return this.http.get<MenuItem[]>(`${this.apiUrl}/menu`); }
  getMenuItems(): Observable<MenuItem[]> { return this.getItems(); }
  addItem(item: Omit<MenuItem, 'id'>): Observable<MenuItem> { return this.http.post<MenuItem>(`${this.apiUrl}/menu`, item); }
  addMenuItem(item: any): Observable<MenuItem> { return this.addItem(item); }
  updateItem(id: string, item: Partial<MenuItem>): Observable<MenuItem> { return this.http.put<MenuItem>(`${this.apiUrl}/menu/${id}`, item); }
  updateMenuItem(id: string, item: Partial<MenuItem>): Observable<MenuItem> { return this.updateItem(id, item); }
  deleteItem(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/menu/${id}`); }
  deleteMenuItem(id: string): Observable<any> { return this.deleteItem(id); }
  getWines(): Observable<WineItem[]> { return this.http.get<WineItem[]>(`${this.apiUrl}/wines`); }
  addWine(wine: Omit<WineItem, 'id'>): Observable<WineItem> { return this.http.post<WineItem>(`${this.apiUrl}/wines`, wine); }
  updateWine(id: string, wine: Partial<WineItem>): Observable<WineItem> { return this.http.put<WineItem>(`${this.apiUrl}/wines/${id}`, wine); }
  deleteWine(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/wines/${id}`); }
  getMenu(): Observable<MenuItem[]> { return this.getItems(); }
  addDish(dish: any) { return this.addItem(dish); }
  updateDish(id: string, dish: any) { return this.updateItem(id, dish); }
  deleteDish(id: string) { return this.deleteItem(id); }
  uploadMenuImage(file: File): Observable<any> { const fd = new FormData(); fd.append('image', file); return this.http.post(`${this.apiUrl}/upload/menu`, fd); }
  uploadWineImage(file: File): Observable<any> { const fd = new FormData(); fd.append('image', file); return this.http.post(`${this.apiUrl}/upload/wine`, fd); }
}
