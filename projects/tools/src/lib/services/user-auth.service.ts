import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  baseUrl = '/Auth';
  constructor(private http: HttpClient) { }

  public checkLogin(user) {
    const url = `${localStorage.getItem('ServerUrl')}${this.baseUrl}`;
    return this.http.post(url, user);
  }

}
