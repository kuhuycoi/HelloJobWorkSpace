import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/authorization/src/environments/environment';
import { CommonUtils } from '../utils/common-utils.service';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private baseUrl = `${environment.serverUrl}/Public`;

  constructor(private http: HttpClient) {}

  public initOTP(data) {
    const url = `${this.baseUrl}/InsertHistorySendOTP`;
    return this.http.post(url, data);
  }
  public initOTPForLogin(data) {
    const url = `${this.baseUrl}/InsertHistorySendOTPForLogin`;
    return this.http.post(url, data);
  }
  public checkOTP(dataSMS) {
    const url = `${this.baseUrl}/FindHistorySendOTP`;
    return this.http.post(url, dataSMS);
  }
  public checkOTPForlogin(dataSMS) {
    const url = `${this.baseUrl}/CheckOTPForlogin`;
    return this.http.post(url, dataSMS);
  }
  public getAllCharacter() {
    const url = `${this.baseUrl}/GetAllCharacter`;
    return this.http.get(url);
  }

  public findAllProvince() {
    let url = `${this.baseUrl}/FindAllProvince`;
    return this.http.get(url);
  }
  public findAllHighSchool() {
    let url = `${this.baseUrl}/FindAllHighSchool`;
    return this.http.get(url);
  }
  public searchHighSchool(keyword?: string) {
    let url = `${this.baseUrl}/SearchHighSchool?keyword=${keyword}`;
    return this.http.get(url);
  }

  public registerStepByStep(user) {
    const url = `${this.baseUrl}/RegisterStepByStep`;
    return this.http.post(url, user);
  }

  public orderContract(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/OrderContract`;
    return this.http.get(url, { params: buildParams });
  }

  public countOrderContractByGroup() {
    const url = `${this.baseUrl}/CountOrderContractByGroup`;
    return this.http.get(url);
  }

  public findAllOrderContractGroup() {
    const url = `${this.baseUrl}/FindAllOrderContractGroup`;
    return this.http.get(url);
  }

  public findAllWebsiteModule(params) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/FindAllWebsiteModule`;
    return this.http.get(url, { params: buildParams });
  }

  public detail(id) {
    const url = `${this.baseUrl}/OrderContract/${id}`;
    return this.http.post(url, null);
  }

  public register(user) {
    const url = `${this.baseUrl}/Register`;
    return this.http.post(url, user);
  }

  public registerCV(data: any) {
    return this.http.post(`${this.baseUrl}/RegisterCustomer`, data);
  }

  public speechToText(data: any) {
    return this.http.post(`${this.baseUrl}/SpeechToText`, data);
  }
  public findAllCVQuestionsAndAnswers(customerID?: number) {
    return this.http.get(
      `${this.baseUrl}/FindAllCVQuestionsAndAnswers${
        customerID ? `?cusID=${customerID}` : ''
      }`
    );
  }
  public getDataForCV(langCode: any, cusID?: any) {
    let httpParams = new HttpParams();
    if (cusID) {
      httpParams = httpParams.append('cusID', cusID);
    }
    if (langCode) {
      httpParams = httpParams.append('langCode', langCode);
    }
    return this.http.get(`${this.baseUrl}/GetDataForCV`, {
      params: httpParams,
    });
  }
  public uploadCV(formData) {
    const url = `${this.baseUrl}/UploadCV`;
    return this.http.post(url, formData);
  }
  public getSocialLoginLinks() {
    const url = `${this.baseUrl}/GetSocialLoginLinks`;
    return this.http.post(url, null);
  }

  public getListCustomerWish(maxResult?: number) {
    const httpParams = CommonUtils.buildParams({ max: maxResult });
    const url = `${this.baseUrl}/ListCustomerWish`;
    return this.http.get(url, { params: httpParams });
  }

  public getListCustomer(maxResult?: number) {
    const httpParams = CommonUtils.buildParams({ max: maxResult });
    const url = `${this.baseUrl}/ListCustomer`;
    return this.http.get(url, { params: httpParams });
  }

  public getWebsiteLanguage(ignoreVN) {
    const url = `${this.baseUrl}/ListWebsiteLanguage?ignoreVN=${ignoreVN}`;
    return this.http.get(url);
  }

  public getListWebsiteOrderContract(maxResult?: number, gImage?: boolean) {
    const httpParams = CommonUtils.buildParams({
      max: maxResult,
      getImage: gImage,
    });
    const url = `${this.baseUrl}/ListWebsiteOrderContract`;
    return this.http.get(url, { params: httpParams });
  }
  public pagerCustomerWish(params?: any) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.baseUrl}/CustomerWishSearch`;
    return this.http.get(url, { params: buildParams });
  }

  public findAllOrderBackground() {
    const url = `${this.baseUrl}/FindAllOrderBackground`;
    return this.http.get(url);
  }

  public checkCanViewCV(customerID: any) {
    const url = `${this.baseUrl}/CheckCanViewCV`;
    return this.http.get(url, { params: { cusID: customerID } });
  }
  public grantOtp(phoneNumber) {
    const url = `${this.baseUrl}/GrantOtp`;
    return this.http.get(url, { params: { username: phoneNumber } });
  }

  public changePasswordUsingOtp(data) {
    const url = `${this.baseUrl}/ChangePasswordUsingOtp`;
    return this.http.post(url, data);
  }

  public getIndexStatistic() {
    const url = `${this.baseUrl}/IndexStatistic`;
    return this.http.get(url);
  }

  public upViewCustomer(cusID) {
    const url = `${this.baseUrl}/UpViewCustomer?cusID=${cusID}`;
    return this.http.post(url, null);
  }
  public getListProvince() {
    const url = `${this.baseUrl}/FindAllProvince`;
    return this.http.get(url);
  }
  public findProvinceByType(type) {
    const url = `${this.baseUrl}/FindProvinceByType/${type}`;
    return this.http.get(url);
  }
  public afiliate(data) {
    const url = `${this.baseUrl}/Affiliate`;
    return this.http.post(url, data);
  }

  public findAllCharacter() {
    let url = `${this.baseUrl}/FindAllCharacter`;
    return this.http.get(url);
  }
}
