import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileType } from 'projects/tools/src/lib/types/profile.type';

@Injectable({
  providedIn: 'root'
})
export class Wf1NewUserService {
  //Variables
  private MIN_STEP = 0;
  private MAX_STEP = 19;
  private isBusy = false;
  public userInfo: ProfileType = new ProfileType();
  private tracking: number = 1;

  constructor() { }
  //Properties
  private getSteps(index: number) {
    switch (index) {
      case 1: return { id: 1, route: '/dang-ky' }
      case 2: return { id: 1, route: '/dang-ky/ung-vien/so-dien-thoai' }
      case 3: return { id: 1, route: '/dang-ky/ung-vien/xac-nhan-otp' }
      case 4: return { id: 1, route: '/dang-ky/ung-vien/email' }
      case 5: return { id: 1, route: '/dang-ky/ung-vien/mang-xa-hoi' }
      case 6: return { id: 1, route: '/dang-ky/ung-vien/dam-bao-thong-tin' }
      case 7: return { id: 1, route: '/dang-ky/ung-vien/ho-ten' }
      case 8: return { id: 1, route: '/dang-ky/ung-vien/ngay-sinh' }
      case 9: return { id: 1, route: '/dang-ky/ung-vien/que-quan' }
      case 10: return { id: 1, route: '/dang-ky/ung-vien/gioi-tinh' }
      case 11: return { id: 1, route: '/dang-ky/ung-vien/chieu-cao' }
      case 12: return { id: 1, route: '/dang-ky/ung-vien/can-nang' }
      case 13: return { id: 1, route: '/dang-ky/ung-vien/tinh-trang-hon-nhan' }
      case 14: return { id: 1, route: '/dang-ky/ung-vien/bang-cap' }
      case 15: return { id: 1, route: '/dang-ky/ung-vien/tinh-cach' }
      case 16: return { id: 1, route: '/dang-ky/ung-vien/kinh-nghiem' }
      case 17: return { id: 1, route: '/dang-ky/ung-vien/mong-muon' }
      case 18: return { id: 1, route: '/dang-ky/ung-vien/anh-dai-dien' }
      case 19: return { id: 1, route: '/dang-ky/ung-vien/xac-nhan' }
      default:
        return { id: 1, route: '' }
    }
  }

  private getIndex(identifier: string) {
    switch (identifier) {
      case 'dang-ky': return 1;
      case 'so-dien-thoai': return 2;
      case 'xac-nhan-otp': return 3;
      case 'email': return 4;
      case 'mang-xa-hoi': return 5;
      case 'dam-bao-thong-tin': return 6;
      case 'ho-ten': return 7;
      case 'ngay-sinh': return 8;
      case 'que-quan': return 9;
      case 'gioi-tinh': return 10;
      case 'chieu-cao': return 11;
      case 'can-nang': return 12;
      case 'tinh-trang-hon-nhan': return 13;
      case 'bang-cap': return 14;
      case 'tinh-cach': return 15;
      case 'kinh-nghiem': return 16;
      case 'mong-muon': return 17;
      case 'anh-dai-dien': return 18;
      case 'xac-nhan': return 19;
      default: return 0;
    }
  }

  //Functions
  public reset(router?: Router) {
    this.userInfo = new ProfileType();
    this.tracking = 0;
    if (router) router.navigateByUrl(this.getSteps(this.tracking).route);
  }

  public moveTo(identifier: number | string, router: Router) {
    if (typeof identifier === 'string') identifier = this.getIndex(identifier);
    if (this.tracking === identifier) return 1;
    if (this.isBusy) return -1;
    this.isBusy = true;
    identifier = this.fixRouteStep(identifier);
    if (this.tracking == this.MAX_STEP) { this.isBusy = false; return 0; }
    this.tracking = identifier;
    var routeTracking=this.getSteps(this.tracking);
    if (router) router.navigateByUrl(routeTracking.route);

    this.isBusy = false;
    return 1;
  }

  private fixRouteStep(identifier: number, up: boolean = true) {
    var ret = identifier;
    switch (identifier) {
      case 5: //link_sns
        if (this.userInfo.otp) return up ? 6 : 4; //greeting or email
        break;
      default: break;
    };
    return ret;
  }

  /**
   * Return: 
   *  1: Chuyển thành công
   *  0: Hết bước
   *  -1: Đang trong quá trình xử lý
   * @param router 
   */
  public nextStep(router: Router) {
    if (this.isBusy) return -1;
    this.isBusy = true;
    if (this.tracking == this.MAX_STEP) { this.isBusy = false; return 0; }
    var identifier = this.tracking + 1;
    identifier = this.fixRouteStep(identifier);
    this.tracking = identifier;
    var routeTracking=this.getSteps(this.tracking);
    if (router) router.navigateByUrl(routeTracking.route);
    this.isBusy = false;
    localStorage.setItem('CURRENT_REGISTER',JSON.stringify(this.userInfo));
    return 1;
  }

  /**
   * Return: 
   *  1: Chuyển thành công
   *  0: Hết bước
   *  -1: Đang trong quá trình xử lý
   * @param router 
   */
  public goBack(router: Router) {
    if (this.isBusy) return -1;
    this.isBusy = true;
    if (this.tracking == this.MIN_STEP) { this.isBusy = false; return 0; }
    var identifier = this.tracking - 1;
    identifier = this.fixRouteStep(identifier, false);
    this.tracking = identifier;
    if (router) router.navigateByUrl(this.getSteps(this.tracking).route);

    this.isBusy = false;
    return 1;
  }

  public getProcessPercent() {
    if (this.tracking < this.MIN_STEP) return 0;
    if (this.tracking == this.MAX_STEP) return 100;
    var ret = Math.floor(this.tracking * 100 / (this.MAX_STEP * 1.0));
    ret = (!ret) ? 1 : ret;
    return ret;
  }
}
