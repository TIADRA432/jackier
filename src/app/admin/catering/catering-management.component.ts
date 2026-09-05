import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CateringService } from '../../core/services/catering.service';
import { CateringOrderDto } from '../../core/dto/catering.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-catering-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
  template: `
    <div class="catering-container">
      <div class="header">
        <h1>Catering Management</h1>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> New Order</button>
      </div>
      <table mat-table [dataSource]="(orders$ | async) ?? []" class="mat-elevation-z8">
        <ng-container matColumnDef="clientName"><th mat-header-cell *matHeaderCellDef> Client </th><td mat-cell *matCellDef="let element"> {{element.clientName}} </td></ng-container>
        <ng-container matColumnDef="eventDate"><th mat-header-cell *matHeaderCellDef> Date </th><td mat-cell *matCellDef="let element"> {{element.eventDate | date:'medium'}} </td></ng-container>
        <ng-container matColumnDef="eventType"><th mat-header-cell *matHeaderCellDef> Type </th><td mat-cell *matCellDef="let element"> {{element.eventType}} </td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef> Status </th><td mat-cell *matCellDef="let element"><span [class]="'status-badge ' + element.status">{{element.status}}</span></td></ng-container>
        <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef> Actions </th><td mat-cell *matCellDef="let element">
          <button mat-icon-button color="primary" (click)="openDialog(element)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deleteOrder(element.id)"><mat-icon>delete</mat-icon></button>
        </td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`.catering-container{padding:20px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}table{width:100%}.status-badge{padding:5px 10px;border-radius:15px;font-size:.8em;text-transform:uppercase}`]
})
export class CateringManagementComponent implements OnInit {
  displayedColumns = ['clientName', 'eventDate', 'eventType', 'status', 'actions'];
  orders$: Observable<CateringOrderDto[]> = new Observable();
  constructor(private cateringService: CateringService, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  ngOnInit() { this.orders$ = this.cateringService.getCateringOrders(); }
  openDialog(order?: CateringOrderDto) {
    const dialogRef = this.dialog.open(CateringOrderDialogComponent, { width: '400px', data: order || {} });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const action = order ? this.cateringService.updateCateringOrder({ ...order, ...result }) : this.cateringService.addCateringOrder(result);
      action.then(() => this.snackBar.open(order ? 'Order updated' : 'Order added', 'Close', { duration: 3000 }));
    });
  }
  deleteOrder(id?: string) { if (id && confirm('Are you sure you want to delete this order?')) this.cateringService.deleteCateringOrder(id).then(() => this.snackBar.open('Order deleted', 'Close', { duration: 3000 })); }
}

@Component({
  selector: 'app-catering-order-dialog', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `<h2 mat-dialog-title>{{data.id ? 'Edit' : 'Add'}} Catering Order</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill"><mat-label>Client Name</mat-label><input matInput formControlName="clientName"></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Event Type</mat-label><input matInput formControlName="eventType"></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Guests</mat-label><input matInput type="number" formControlName="guests"></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Budget</mat-label><input matInput type="number" formControlName="budget"></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Status</mat-label><mat-select formControlName="status">
        <mat-option value="pending">Pending</mat-option><mat-option value="approved">Approved</mat-option><mat-option value="in-progress">In Progress</mat-option><mat-option value="completed">Completed</mat-option>
      </mat-select></mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end"><button mat-button mat-dialog-close>Cancel</button><button mat-raised-button color="primary" [mat-dialog-close]="form.value" [disabled]="form.invalid">Save</button></mat-dialog-actions>`,
  styles: [`mat-form-field{width:100%;margin-bottom:10px}`]
})
export class CateringOrderDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: CateringOrderDto) {
    this.form = this.fb.group({ clientName: [data?.clientName || '', Validators.required], eventType: [data?.eventType || '', Validators.required], guests: [data?.guests || 0, [Validators.required, Validators.min(1)]], budget: [data?.budget || 0, [Validators.required, Validators.min(0)]], status: [data?.status || 'pending', Validators.required], eventDate: [data?.eventDate || new Date().toISOString()] });
  }
}
