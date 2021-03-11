import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Users } from '../types/users';
import { Customer } from '../types/customer';
import { PartnerCompany } from '../types/partner-company';
import { CommonUtils } from '../utils/common-utils.service';
import { ResponseApi } from '../types/response-api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  currentUser: BehaviorSubject<Users> = new BehaviorSubject(null);
  currentCustomer: BehaviorSubject<Customer> = new BehaviorSubject(null);
  currentPartner: BehaviorSubject<PartnerCompany> = new BehaviorSubject(null);
  isBlank: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOpenedSidenav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isOpenedNotify: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  activeBottomNav: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  fixedHeader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  previousUrl: string;
  constructor(
    private http: HttpClient,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  public loadUserInfo() {
    if (localStorage.getItem('CURRENT_USER')) {
      const combined = combineLatest([
        this.userInfo(),
        this.customerInfo(),
        this.getPartnerCompany(),
      ]);
      combined.subscribe(([userRes, cusRes, partnerRes]: any[]) => {
        this.currentUser.next(userRes.data);
        this.currentCustomer.next(cusRes.data);
        this.currentPartner.next(partnerRes.data);
        this.loaded.next(true);
      });
    } else {
      this.currentUser.next(null);
      this.currentCustomer.next(null);
      this.currentPartner.next(null);
      this.loaded.next(true);
    }
  }

  public userInfo() {
    const url = `${this.baseUrl}/Info`;
    return this.http.post(url, null);
  }
  public customerInfo() {
    const url = `${this.baseUrl}/GetCustomerInfo`;
    return this.http.post(url, null);
  }

  public updateInfo(userInfo) {
    const url = `${this.baseUrl}/UpdateInfo`;
    return this.http.post(url, userInfo);
  }

  public updateAvatar(data) {
    const url = `${this.baseUrl}/UpdateAvatar`;
    return this.http.post(url, data);
  }

  public signOut() {
    localStorage.removeItem('CURRENT_USER');
    location.href = '/';
  }

  public changePassword(data) {
    const url = `${this.baseUrl}/ChangePassword`;
    return this.http.post(url, data);
  }

  public favourite(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/Favourite?`;
    return this.http.get(url, { params: buildParams });
  }

  public historyRecuitment(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/HistoryRecruitment?`;
    return this.http.get(url, { params: buildParams });
  }

  public getListRecruitmentByPartner(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/RecruitmentByPartner?`;
    return this.http.get(url, { params: buildParams });
  }

  public checkWebsiteOrderContractList(ids) {
    const url = `${this.baseUrl}/CheckWebsiteOrderContractList`;
    return this.http.post(url, ids);
  }

  public save(id) {
    const url = `${this.baseUrl}/Favourite/Save?id=${id}`;
    return this.http.post(url, null);
  }

  public saveOrUpdatePartnerCompany(partner) {
    const url = `${this.baseUrl}/Partner/SaveOrUpdate`;
    return this.http.post(url, partner);
  }

  public getPartnerCompany(): Observable<ResponseApi> {
    const url = `${this.baseUrl}/Partner`;
    return this.http.get(url);
  }

  public getOrderContractByPartner(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/GetOrderContractByPartnerId`;
    return this.http.get(url, { params: buildParams });
  }
  public websiteOrderContractPosted(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/WebsiteOrderContractPosted`;
    return this.http.get(url, { params: buildParams });
  }
  public findAllWebsiteOrderContractPosted(params?: any) {
    const url = `${this.baseUrl}/FindAllWebsiteOrderContractPosted`;
    return this.http.get(url);
  }

  public findOneWebsiteOrderContract(id) {
    const url = `${this.baseUrl}/WebsiteOrderContract/${id}`;
    return this.http.get(url);
  }

  public websiteOrderContractInsert(data) {
    const url = `${this.baseUrl}/WebsiteOrderContract/Insert`;
    return this.http.post(url, data);
  }

  public translateWebsiteOrderContractToVI(data) {
    const url = `${this.baseUrl}/WebsiteOrderContract/TranslateToVI`;
    return this.http.post(url, data);
  }

  public websiteOrderContractEdit(data) {
    const url = `${this.baseUrl}/WebsiteOrderContract/Edit`;
    return this.http.post(url, data);
  }

  public websiteOrderContractDelete(id) {
    const url = `${this.baseUrl}/WebsiteOrderContract/Delete/${id}`;
    return this.http.post(url, null);
  }
  public getListCvApply() {
    const url = `${this.baseUrl}/ListCvApply`;
    return this.http.get(url);
  }

  public acceptRecruitment(id) {
    const url = `${this.baseUrl}/RecruitmentInfo/Accept/${id}`;
    return this.http.post(url, null);
  }

  public refuseRecruitment(id) {
    const url = `${this.baseUrl}/RecruitmentInfo/Refuse/${id}`;
    return this.http.post(url, null);
  }

  public findOneCustomerWish() {
    const url = `${this.baseUrl}/CustomerWish`;
    return this.http.get(url);
  }

  public customerWishEdit(data) {
    const url = `${this.baseUrl}/CustomerWish/Edit`;
    return this.http.post(url, data);
  }

  public pagerMyReferrals(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/MyReferrals`;
    return this.http.get(url, { params: buildParams });
  }

  public checkReferralOwner(customerID: any) {
    const body = new HttpParams({ fromObject: { cusID: customerID } });
    const url = `${this.baseUrl}/CheckReferralOwner`;
    return this.http.post(url, body);
  }

  public findOneMyReferrals(id) {
    const url = `${this.baseUrl}/MyReferral/${id}`;
    return this.http.get(url);
  }
  public getRecruitmentStatusByUsername(id) {
    const url = `${this.baseUrl}/RecruitmentInfo/Status/${id}`;
    return this.http.get(url);
  }
  public findAllCVQuestionsAndAnswers(customerID?: number) {
    return this.http.get(`${this.baseUrl}/FindCVInfoOfReferral`, {
      params: customerID ? { cusID: customerID.toString() } : null,
    });
  }

  public checkCustomerWishList(ids) {
    const url = `${this.baseUrl}/CheckCustomerWishList`;
    return this.http.post(url, ids);
  }

  public checkCustomerList(ids) {
    const url = `${this.baseUrl}/CheckCustomerList`;
    return this.http.post(url, ids);
  }

  public favouriteRecruitments(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/FavouriteRecruitments`;
    return this.http.get(url, { params: buildParams });
  }
  public insertFavouriteRecruitment(id) {
    const url = `${this.baseUrl}/FavouriteRecruitment/Save?id=${id}`;
    return this.http.post(url, null);
  }

  public saveCustomerWishByCustomerID(id) {
    const url = `${this.baseUrl}/FavouriteRecruitment/SaveByCustomerID?id=${id}`;
    return this.http.post(url, null);
  }

  public getDataForCV(id, langCode?) {
    let httpParams = new HttpParams();
    if (id) {
      httpParams = httpParams.append('id', id);
    }
    if (langCode) {
      httpParams = httpParams.append('langCode', langCode);
    }
    return this.http.get(`${this.baseUrl}/FindCVInfo`, { params: httpParams });
  }

  public countRecruitmentInfo(): Observable<any> {
    const url = `${this.baseUrl}/CountRecruitment`;
    return this.http.get(url);
  }

  public stopRecruitment(webId): Observable<any> {
    const url = `${this.baseUrl}/WebsiteOrderContract/Stop`;
    const body = new HttpParams({ fromObject: { id: webId } });
    return this.http.post(url, body);
  }

  public websiteOrderContractMakeCode(): Observable<any> {
    const url = `${this.baseUrl}/WebsiteOrderContract/MakeCode`;
    return this.http.post(url, null);
  }

  public deleteReferral(cusID) {
    const body = new HttpParams({ fromObject: { id: cusID } });
    const url = `${this.baseUrl}/DeleteReferral`;
    return this.http.post(url, body);
  }

  public changePublicPhonenumber() {
    const url = `${this.baseUrl}/ChangePublicPhonenumber`;
    return this.http.post(url, null);
  }

  public changePublicCV(publicCV) {
    const body = new HttpParams({ fromObject: { isPublicCV: publicCV } });
    const url = `${this.baseUrl}/ChangePublicCV`;
    return this.http.post(url, body);
  }

  public myReferralChangePublicCV(publicCV, cusID) {
    const body = new HttpParams({
      fromObject: { isPublicCV: publicCV, customerID: cusID },
    });
    const url = `${this.baseUrl}/MyReferralChangePublicCV`;
    return this.http.post(url, body);
  }

  public deleteWebsiteOrderContractGallery(webOCGId, urlG) {
    const body = new HttpParams({
      fromObject: { websiteOrderContractID: webOCGId, url: urlG },
    });
    const url = `${this.baseUrl}/WebsiteOrderContractGallery/Delete`;
    return this.http.post(url, body);
  }
}
