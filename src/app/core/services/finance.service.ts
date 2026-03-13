import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinanceReportDto } from '../dto/finance.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/finance/expenses`);
  }

  getDailyReports(): Observable<FinanceReportDto[]> {
    return this.http.get<FinanceReportDto[]>(`${this.apiUrl}/finance/reports`);
  }

  getReports(): Observable<FinanceReportDto[]> {
    return this.getDailyReports();
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/finance/expenses`, expense);
  }

  dailyClose(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/finance/close`, data);
  }
}
