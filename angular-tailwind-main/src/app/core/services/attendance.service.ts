import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseURL = environment.apiUrl;
  contentUpdateNeeded = new Subject<{}>();

  constructor(private http: HttpClient) {}

  postContent(body: {}) {
    return this.http.post<any>(this.baseURL + 'contents', body).pipe((s) => s);
  }
}
