import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonUtils } from '../utils/common-utils.service';

@Injectable({
  providedIn: 'root'
})
export class VocabularySharedService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  constructor(private http: HttpClient) { }

  public pagerVocabularyShared(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/VocabularySharedSearch`;
    return this.http.get(url, { params: buildParams });
  }

  public listCustomerShare() {
    const url = `${this.baseUrl}/ListCustomerShare`;
    return this.http.get(url);
  }

  public listSharedByCustomerWish(customerWishID) {
    const url = `${this.baseUrl}/ListSharedByCustomerWish?customerWishID=${customerWishID}`;
    return this.http.get(url);
  }

  public shareInfo(cusWishID, phone) {
    const body = new HttpParams({ fromObject: { customerWishID: cusWishID, phonenumber: phone } });
    const url = `${this.baseUrl}/VocabularyShare/Insert`;
    return this.http.post(url, body);
  }

  public vocabularyShareDelete(id) {
    const body = new HttpParams({ fromObject: { vocabularyShareID: id } });
    const url = `${this.baseUrl}/VocabularyShare/Delete`;
    return this.http.post(url, body);
  }

  public getCustomerWishInfo() {
    const url = `${this.baseUrl}/CustomerWishInfo`;
    return this.http.get(url);
  }
}
