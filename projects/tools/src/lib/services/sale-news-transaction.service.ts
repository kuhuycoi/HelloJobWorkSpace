import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from './common-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SaleNewsTransactionService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public saleNewsTransactionBySaleNewsId(data) {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.baseUrl}/SaleNewsTransactionBySaleNewID?`;
    return this.http.get(url, { params: buildParams });
  }
  public findOrderContractBySaleNewsId(data) {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.baseUrl}/WocBySaleNewID?`;
    return this.http.get(url, { params: buildParams });
  }
  public getFormBySaleNewID(data) {
    const buildParams = CommonUtils.buildParams(data);
    const url = `${this.baseUrl}/GetFormBySaleNewID?`;
    return this.http.get(url, { params: buildParams });
  }

  public saleNewTransactionServicePager(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/SaleNewsTransaction?`;
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
  public insertSaleNewsTransaction(data) {
    const url = `${this.baseUrl}/SaleNewsTransaction/Insert`;
    return this.http.post(url, data);
  }
  public insertNegotiation(data) {
    const url = `${this.baseUrl}/SaleNewsTransaction/InsertNegotiation`;
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

  public areeBuyForm(id) {
    const url = `${this.baseUrl}/SaleNewsTransaction/AgreeBuyForm/${id}`;
    // const url = `${this.baseUrl}/WebsiteOrderContract/Stop`;
    // const body = new HttpParams({ fromObject: { id: webId } });
    return this.http.post(url, null);
  }
  public refuseBuyForm(id) {
    const url = `${this.baseUrl}/SaleNewsTransaction/RefuseBuyForm/${id}`;
    return this.http.post(url, null);
  }
  public updateReadNotyStatus(id) {
    const url = `${this.baseUrl}/SaleNewsTransaction/UpdateReadedNoty/${id}`;
    return this.http.post(url, null);
  }
}
