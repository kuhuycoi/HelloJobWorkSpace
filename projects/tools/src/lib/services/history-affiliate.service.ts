import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUtils } from '../utils/common-utils.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryAffiliateService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/HistoryAffiliate`;

  constructor(private http: HttpClient) { }

  public pager(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}`;
    return this.http.get(url, { params: buildParams });
  }

  public checkAffiliate(id) {
    const body = new HttpParams({ fromObject: { 'id': id } });
    const url = `${this.baseUrl}/Check`;
    return this.http.post(url, body);
  }
  public deleteAffiliate(id) {
    const body = new HttpParams({ fromObject: { 'id': id } });
    const url = `${this.baseUrl}/Delete`;
    return this.http.post(url, body);
  }
}
