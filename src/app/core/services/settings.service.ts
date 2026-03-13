import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { SettingsDto } from '../dto/settings.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSettings(): Observable<SettingsDto> {
    return this.http.get<SettingsDto>(`${this.apiUrl}/settings`);
  }

  updateSettings(settings: SettingsDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/settings`, settings);
  }

  async getSettingsPromise(): Promise<SettingsDto> {
    const settings = await firstValueFrom(this.getSettings());
    return settings || {} as SettingsDto;
  }

  async updateSettingsPromise(settings: SettingsDto): Promise<void> {
    await firstValueFrom(this.updateSettings(settings));
  }
}
