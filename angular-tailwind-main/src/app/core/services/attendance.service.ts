import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseURL = environment.apiUrl;
  attendanceUpdateNeeded = new Subject<void>();

  constructor(private http: HttpClient) {}

  createAttendance(body: {}) {
    return this.http.post<any>(this.baseURL + 'attendance', body).pipe((s) => s);
  }

  getAttendance() {
    return this.http.get<any>(this.baseURL + 'attendance').pipe((s) => s);
  }

  searchAttendance(search: any) {
    return this.http.get<any>(this.baseURL + 'attendance/?search=' + search);
  }

  deleteAttendance(id: string) {
    return this.http.delete<any>(this.baseURL + 'attendance/the-attendance/' + id).pipe((s) => s);
  }


}
