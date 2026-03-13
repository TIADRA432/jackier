import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardOverviewDto } from '../dto/dashboard.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardOverviewDto> {
    return this.http.get<DashboardOverviewDto>(`${environment.apiUrl}/dashboard/overview`);
  }

  getStats(): Observable<any> {
    return this.getDashboard();
  }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/dashboard/recent-activity`);
  }
}
