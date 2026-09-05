import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryImage } from '../../core/models/models';
import { Observable, firstValueFrom } from 'rxjs';

@Component({selector:'app-gallery-management',standalone:true,imports:[CommonModule,MatGridListModule,MatButtonModule,MatIconModule,MatDialogModule,MatInputModule,MatFormFieldModule,MatSelectModule,MatSnackBarModule,ReactiveFormsModule],template:`
<div class="gallery-container"><div class="header"><h1>Gallery Management</h1><button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add_photo_alternate</mat-icon> Upload Image</button></div>
<mat-grid-list cols="3" rowHeight="1:1" gutterSize="10px"><mat-grid-tile *ngFor="let image of images$ | async"><img [src]="image.imageUrl" [alt]="image.title"><mat-grid-tile-footer><h3>{{image.title}}</h3><span class="spacer"></span><button mat-icon-button (click)="deleteImage(image.id)"><mat-icon>delete</mat-icon></button></mat-grid-tile-footer></mat-grid-tile></mat-grid-list></div>`,styles:[`.gallery-container{padding:20px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}img{width:100%;height:100%;object-fit:cover}.spacer{flex:1 1 auto}`]})
export class GalleryManagementComponent implements OnInit {
 images$: Observable<GalleryImage[]>;
 constructor(private galleryService:GalleryService,private dialog:MatDialog,private snackBar:MatSnackBar){}
 ngOnInit(){this.images$=this.galleryService.getGalleryImages();}
 async openDialog(){const ref=this.dialog.open(GalleryImageDialogComponent,{width:'400px'});const result=await firstValueFrom(ref.afterClosed());if(result){await firstValueFrom(this.galleryService.addGalleryImage({...result,uploadedAt:new Date() as any}));this.snackBar.open('Image uploaded','Close',{duration:3000});}}
 async deleteImage(id?:string){if(id&&confirm('Are you sure you want to delete this image?')){await firstValueFrom(this.galleryService.deleteGalleryImage(id));this.snackBar.open('Image deleted','Close',{duration:3000});}}
}
@Component({selector:'app-gallery-image-dialog',standalone:true,imports:[CommonModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatButtonModule],template:`<h2 mat-dialog-title>Upload Image</h2><mat-dialog-content [formGroup]="form"><mat-form-field appearance="fill"><mat-label>Title</mat-label><input matInput formControlName="title"></mat-form-field><mat-form-field appearance="fill"><mat-label>Category</mat-label><input matInput formControlName="category"></mat-form-field><mat-form-field appearance="fill"><mat-label>Image URL</mat-label><input matInput formControlName="imageUrl"></mat-form-field></mat-dialog-content><mat-dialog-actions align="end"><button mat-button mat-dialog-close>Cancel</button><button mat-raised-button color="primary" [mat-dialog-close]="form.value" [disabled]="form.invalid">Upload</button></mat-dialog-actions>`,styles:[`mat-form-field{width:100%;margin-bottom:10px}`]})
export class GalleryImageDialogComponent {form:FormGroup;constructor(private fb:FormBuilder){this.form=this.fb.group({title:['',Validators.required],category:['',Validators.required],imageUrl:['',Validators.required]});}}
