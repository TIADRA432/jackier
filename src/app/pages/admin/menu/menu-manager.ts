
import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { MenuCategory, MenuItem, WineItem } from '../../../core/models/menu.model';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-menu-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-manager.html',
  styleUrls: ['./menu-manager.css']
})
export class MenuManager implements OnInit {
  private menuService = inject(MenuService);
  private fb = inject(FormBuilder);

  activeTab = signal<'categories' | 'items' | 'wines'>('items');
  
  categories = signal<MenuCategory[]>([]);
  items = signal<MenuItem[]>([]);
  wines = signal<WineItem[]>([]);

  // Forms
  categoryForm: FormGroup;
  itemForm: FormGroup;
  wineForm: FormGroup;

  private http = inject(HttpClient);
  isUploading = signal<boolean>(false);

  async uploadImage(event: Event, type: 'menu' | 'wine') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    this.isUploading.set(true);
    
    this.http.post<{url: string}>(`${environment.apiUrl}/upload/${type}`, formData).subscribe({
      next: (res) => {
        if (type === 'menu') {
          this.itemForm.patchValue({ imageUrl: res.url });
        } else {
          this.wineForm.patchValue({ imageUrl: res.url });
        }
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Erreur lors du téléchargement de l\'image');
        this.isUploading.set(false);
      }
    });
  }

  editingId = signal<string | null>(null);
  showForm = signal<boolean>(false);

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      order: [0, Validators.required],
      active: [true]
    });

    this.itemForm = this.fb.group({
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      isFeatured: [false],
      displayOrder: [0],
      active: [true],
      dietaryTags: [''], // Will split by comma
      allergens: [''] // Will split by comma
    });

    this.wineForm = this.fb.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      grape: ['', Validators.required],
      year: [null],
      description: ['', Validators.required],
      pairingSuggestion: [''],
      priceBottle: [0, [Validators.required, Validators.min(0)]],
      priceGlass: [null],
      imageUrl: [''],
      displayOrder: [0],
      active: [true]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.menuService.getCategories().subscribe(data => this.categories.set(data));
    this.menuService.getItems().subscribe(data => this.items.set(data));
    this.menuService.getWines().subscribe(data => this.wines.set(data));
  }

  setTab(tab: 'categories' | 'items' | 'wines') {
    this.activeTab.set(tab);
    this.cancelEdit();
  }

  openAddForm() {
    this.editingId.set(null);
    this.showForm.set(true);
    this.categoryForm.reset({ order: 0, active: true });
    this.itemForm.reset({ price: 0, displayOrder: 0, active: true });
    this.wineForm.reset({ priceBottle: 0, displayOrder: 0, active: true });
  }

  editCategory(cat: MenuCategory) {
    this.editingId.set(cat.id);
    this.categoryForm.patchValue(cat);
    this.showForm.set(true);
  }

  editItem(item: MenuItem) {
    this.editingId.set(item.id);
    this.itemForm.patchValue({
      ...item,
      dietaryTags: item.dietaryTags?.join(', ') || '',
      allergens: item.allergens?.join(', ') || ''
    });
    this.showForm.set(true);
  }

  editWine(wine: WineItem) {
    this.editingId.set(wine.id);
    this.wineForm.patchValue(wine);
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    const data = this.categoryForm.value;
    const id = this.editingId();
    
    if (id) {
      this.menuService.updateCategory(id, data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    } else {
      this.menuService.addCategory(data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    }
  }

  saveItem() {
    if (this.itemForm.invalid) return;
    const formVal = this.itemForm.value;
    const data = {
      ...formVal,
      dietaryTags: formVal.dietaryTags ? formVal.dietaryTags.split(',').map((s: string) => s.trim()) : [],
      allergens: formVal.allergens ? formVal.allergens.split(',').map((s: string) => s.trim()) : []
    };
    const id = this.editingId();
    
    if (id) {
      this.menuService.updateItem(id, data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    } else {
      this.menuService.addItem(data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    }
  }

  saveWine() {
    if (this.wineForm.invalid) return;
    const data = this.wineForm.value;
    const id = this.editingId();
    
    if (id) {
      this.menuService.updateWine(id, data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    } else {
      this.menuService.addWine(data).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Supprimer cette catégorie ?')) {
      this.menuService.deleteCategory(id).subscribe(() => this.loadData());
    }
  }

  deleteItem(id: string) {
    if (confirm('Supprimer ce plat ?')) {
      this.menuService.deleteItem(id).subscribe(() => this.loadData());
    }
  }

  deleteWine(id: string) {
    if (confirm('Supprimer ce vin ?')) {
      this.menuService.deleteWine(id).subscribe(() => this.loadData());
    }
  }

  getCategoryName(id: string) {
    return this.categories().find(c => c.id === id)?.name || 'Inconnue';
  }
}
