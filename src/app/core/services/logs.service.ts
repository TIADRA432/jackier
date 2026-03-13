import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { LogDto } from '../dto/log.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getLogs(): Observable<LogDto[]> {
    return this.http.get<LogDto[]>(`${this.apiUrl}/logs`);
  }

  async getLogsPromise(): Promise<LogDto[]> {
    return await firstValueFrom(this.getLogs());
  }
}
