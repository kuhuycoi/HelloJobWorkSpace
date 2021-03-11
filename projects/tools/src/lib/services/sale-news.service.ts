import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from './common-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SaleNewsService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public saleNewPager(params?: any) {
    if (typeof params.moduleIds === typeof[]) {
      params.moduleIds = '';
    }
    if (typeof params.jobProvince === typeof[]) {
      params.jobProvince = '';
    }
    if (typeof params.ageRangeValue === typeof[]) {
      params.ageRangeValue = '';
    }
    if (typeof params.weightRangeValue === typeof[]) {
      params.weightRangeValue = '';
    }
    if (typeof params.salaryRange === typeof[]) {
      params.salaryRange = '';
    }
    if (typeof params.heightRangeValue === typeof[]) {
      params.heightRangeValue = '';
    }
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/SaleNews?`;
    return this.http.get(url, { params: buildParams });
  }
  public saleNewPagerByPartner(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/SaleNews/GetByPartner?`;
    return this.http.get(url, { params: buildParams });
  }
  public saleNewPagerByPartnerId(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/SaleNews/GetByPartnerId?`;
    return this.http.get(url, { params: buildParams });
  }
  public insertSaleNews(data) {
    const url = `${this.baseUrl}/SaleNews/Insert`;
    return this.http.post(url, data);
  }

  public saleNewsEdit(data) {
    const url = `${this.baseUrl}/SaleNews/Edit`;
    return this.http.post(url, data);
  }

  public delete(id) {
    const url = `${this.baseUrl}/SaleNews/Delete/${id}`;
    return this.http.post(url, null);
  }

  public saleNewsShow(id) {
    const url = `${this.baseUrl}/SaleNews/Show/${id}`;
    return this.http.post(url, null);
  }

  public done(id) {
    const url = `${this.baseUrl}/SaleNews/Done/${id}`;
    return this.http.post(url, null);
  }
}
