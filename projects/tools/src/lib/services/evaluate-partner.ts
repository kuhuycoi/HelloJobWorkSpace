import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from '../types/customer';
import { Users } from '../types/users';
import { PartnerCompany } from '../types/partner-company';
import { CommonUtils } from '../utils/common-utils.service';

@Injectable({
  providedIn: 'root',
})
export class EvaluatePartnerService {
  baseUrl = `${localStorage.getItem('ServerUrl')}/User`;
  basePublicUrl = `${localStorage.getItem('ServerUrl')}/Public`;
  currentUser: BehaviorSubject<Users> = new BehaviorSubject(null);
  currentCustomer: BehaviorSubject<Customer> = new BehaviorSubject(null);
  currentPartner: BehaviorSubject<PartnerCompany> = new BehaviorSubject(null);
  isBlank: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOpenedSidenav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(
    private http: HttpClient,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  public evaluatePartnerCompanyInsert(data) {
    const url = `${this.baseUrl}/EvaluatePartnerCompany/Insert`;
    return this.http.post(url, data);
  }

  public evaluatePartnerCompanyEdit(data) {
    const url = `${this.baseUrl}/EvaluatePartnerCompany/Edit`;
    return this.http.post(url, data);
  }

  public getPartnerInfo(id) {
    const url = `${this.basePublicUrl}/PartnerInfo/${id}`;
    return this.http.get(url);
  }

  public getPartnerInfoAverage(id) {
    const url = `${this.basePublicUrl}/PartnerInfoAverage/${id}`;
    return this.http.get(url);
  }

  public getStatisticalVotee(id) {
    const url = `${this.basePublicUrl}/EvaluatePartnerCompany/StatisticalVote/${id}`;
    return this.http.get(url);
  }

  public evaluatePartnerSearch(params) {
    const buildParams = CommonUtils.buildParams(params);
    const url = `${this.basePublicUrl}/EvaluatePartnerCompany/Search`;
    return this.http.get(url, { params: buildParams });
  }
}
