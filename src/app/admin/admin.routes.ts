import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuManagementComponent } from './menu/menu-management.component';
import { ReservationManagementComponent } from './reservations/reservation-management.component';
import { CateringManagementComponent } from './catering/catering-management.component';
import { SchoolManagementComponent } from './school/school-management.component';
import { FinanceManagementComponent } from './finance/finance-management.component';
import { GalleryManagementComponent } from './gallery/gallery-management.component';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'menu', component: MenuManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER', 'CHEF'] } },
      { path: 'reservations', component: ReservationManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER', 'RECEPTION'] } },
      { path: 'catering', component: CateringManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER', 'CHEF'] } },
      { path: 'school', component: SchoolManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER'] } },
      { path: 'finance', component: FinanceManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'FINANCE'] } },
      { path: 'gallery', component: GalleryManagementComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'MANAGER', 'EDITOR'] } }
    ]
  }
];
