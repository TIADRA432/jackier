import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolProgramDto } from '../dto/school.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  getPrograms(): Observable<SchoolProgramDto[]> { return this.http.get<SchoolProgramDto[]>(`${this.apiUrl}/school`); }
  getSchoolPrograms(): Observable<SchoolProgramDto[]> { return this.getPrograms(); }
  createProgram(program: SchoolProgramDto): Observable<SchoolProgramDto> { return this.http.post<SchoolProgramDto>(`${this.apiUrl}/school`, program); }
  addProgram(program: SchoolProgramDto): Promise<SchoolProgramDto> { return this.createProgram(program).toPromise() as Promise<SchoolProgramDto>; }
  addSchoolProgram(program: SchoolProgramDto): Promise<SchoolProgramDto> { return this.addProgram(program); }
  updateProgram(id: string, program: Partial<SchoolProgramDto>): Promise<void> { return this.http.put(`${this.apiUrl}/school/${id}`, program).toPromise().then(() => undefined); }
  updateSchoolProgram(program: SchoolProgramDto): Promise<void> { return this.updateProgram(program.id!, program); }
  toggleProgramStatus(id: string, active: boolean): Promise<void> { return this.updateProgram(id, { active }); }
  deleteProgram(id: string): Promise<void> { return this.http.delete(`${this.apiUrl}/school/${id}`).toPromise().then(() => undefined); }
  deleteSchoolProgram(id: string): Promise<void> { return this.deleteProgram(id); }
}
