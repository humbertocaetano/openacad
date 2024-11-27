import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserLevel } from '../models/user-level.interface';

@Injectable({
  providedIn: 'root'
})
export class UserLevelService {
  private apiUrl = `${environment.apiUrl}/user-levels`;

  constructor(private http: HttpClient) { }

  getLevels(): Observable<UserLevel[]> {
    return this.http.get<UserLevel[]>(this.apiUrl);
  }
}
