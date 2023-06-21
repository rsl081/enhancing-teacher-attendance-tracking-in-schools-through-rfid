import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReplaySubject, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserRoot } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseURL = environment.apiUrl;
  public currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  userUpdateNeeded = new Subject<{}>();

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(this.baseURL + 'account/login', credentials).pipe(
      map((response: User) => {
        let user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  registerFaculty(values: any) {
    return this.http.post<User>(this.baseURL + 'account/faculty/register', values);
  }

  getAllFaculty() {
    return this.http.get<UserRoot>(this.baseURL + 'account/faculty/all').pipe(map((f) => f.data));
  }

  deleteFaculty(id: any) {
    return this.http.delete<any>(this.baseURL + 'account/faculty/delete/' + id);
  }

  editFaculty(faculty: {}) {
    return this.http.put(this.baseURL + 'account/faculty/update', faculty);
  }

  setCurrentUser(user: User) {
    if (user !== null) {
      user.role = this.getDecodedToken(user.token).role;
      this.currentUserSource.next(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
