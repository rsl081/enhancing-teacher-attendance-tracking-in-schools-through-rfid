import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseURL = environment.apiUrl;
  attendanceUpdateNeeded = new Subject<void>();

  constructor(private http: HttpClient) {}

  createAttendanceDate(body: {}) {
    return this.http.post<any>(this.baseURL + 'attendance', body).pipe((s) => s);
  }

  createAttendance(body: {}) {
    return this.http.post<any>(this.baseURL + 'attendance/the-attendance', body).pipe((s) => s);
  }

  getAttendance() {
    return this.http.get<any>(this.baseURL + 'attendance').pipe((s) => s);
  }

  searchAttendanceDate(search: any) {
    return this.http.get<any>(this.baseURL + 'attendance/?search=' + search);
  }

  deleteAttendance(id: string) {
    return this.http.delete<any>(this.baseURL + 'attendance/the-attendance/' + id).pipe((s) => s);
  }

  updateAttendance(body: {}) {
    return this.http.put<any>(this.baseURL + 'attendance/the-attendance', body).pipe((s) => s);
  }

  searchAttendance(search: any,searchAttendanceDateId:any) {
    return this.http.get<any>(
      this.baseURL +
        'attendance/the-attendance/?search=' +
        search +
        '&searchAttendanceDateId=' +
        searchAttendanceDateId,
    );
  }

  //* DateTime
  getGetTimeAndDate(): Observable<any> {
    return this.http.get<any>(this.baseURL + 'attendance/datetime').pipe((s) => s);
  }
}
