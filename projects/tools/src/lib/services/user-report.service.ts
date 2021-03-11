import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public report(data?: any) {
    const url = `${this.baseUrl}/UserReport`;
    return this.http.post(url, data);
  }
  
}
