import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from '../utils/common-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public userNotificationPager(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/UserNotification?`;
    return this.http.get(url, { params: buildParams });
  }

  public check(id) {
    const url = `${this.baseUrl}/CheckNotification/${id}`;
    return this.http.post(url, null);
  }

  public totalNotification() {
    const url = `${this.baseUrl}/TotalNotification`;
    return this.http.get(url);
  }
}
