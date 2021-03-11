import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserReportReasonService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public getAllAvaiable(params?: any) {
    const url = `${this.baseUrl}/UserReportReason?`;
    return this.http.get(url);
  }
 
}
