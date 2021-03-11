import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, CanActivateChild } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PartnerGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private snackBar: MatSnackBar) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem('CURRENT_USER')) {
      this.router.navigate(['/tai-khoan/dang-ky'], { queryParams: { returnUrl: state.url, isPartner: true } });
      return false;
    }
    return true;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (state.url.startsWith('/doi-tac/thong-tin')) {
      return true;
    }
    if (this.userService.loaded.value) {
      return this.checkActivateChild(false, decodeURIComponent(state.url));
    } else {
      this.userService.loaded.subscribe(loaded => {
        if (loaded) {
          return this.checkActivateChild(true, state.url);
        } else {
          return false;
        }
      });
    }
  }
  checkActivateChild(isFirst, nextUrl) {
    if (isFirst) {
      const partner = this.userService.currentPartner.value;
      if (partner && !partner.isCheck) {
        this.snackBar.open('Hello Job đang kiểm duyệt thông tin của bạn', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        this.router.navigate(['/']);
      } else if (partner) {
        this.router.navigateByUrl(nextUrl);
      } else {
        this.router.navigate(['/doi-tac/thong-tin'], { queryParams: { returnUrl: nextUrl } });
      }
    } else {
      const partner = this.userService.currentPartner.value;
      if (partner && !partner.isCheck) {
        this.snackBar.open('Hello Job đang kiểm duyệt thông tin của bạn', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        this.router.navigate(['/']);
        return false;
      } else if (partner) {
        return true;
      } else {
        this.router.navigate(['/doi-tac/thong-tin'], { queryParams: { returnUrl: nextUrl } });
        return false;
      }
    }
  }
}
