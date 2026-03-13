import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolProgramDto } from '../dto/school.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPrograms(): Observable<SchoolProgramDto[]> {
    return this.http.get<SchoolProgramDto[]>(`${this.apiUrl}/school`);
  }

  createProgram(program: SchoolProgramDto): Observable<SchoolProgramDto> {
    return this.http.post<SchoolProgramDto>(`${this.apiUrl}/school`, program);
  }

  addProgram(program: SchoolProgramDto): Promise<SchoolProgramDto> {
    return new Promise((resolve, reject) => {
      this.createProgram(program).subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(err)
      });
    });
  }

  updateProgram(id: string, program: Partial<SchoolProgramDto>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.put(`${this.apiUrl}/school/${id}`, program).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  toggleProgramStatus(id: string, active: boolean): Promise<void> {
    return this.updateProgram(id, { active });
  }

  deleteProgram(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/school/${id}`).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }
}
