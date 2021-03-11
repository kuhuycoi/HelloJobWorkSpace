import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class EditReferralGuard implements CanActivate {
  constructor(private snackBar: MatSnackBar, private userService: UserService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cusID = next.params.id;
    return this.checkReferralOwner(cusID);
  }
  async checkReferralOwner(cusID) {
    const res: ResponseApi = await this.userService.checkReferralOwner(cusID).toPromise();
    if (!res || !res.success || !res.data) {
      this.snackBar.open('Bạn không thể thực hiện điều này', 'x', {
        panelClass: ['style-error'],
        duration: 2500
      });
      return false;
    }
    return true;
  }
}
