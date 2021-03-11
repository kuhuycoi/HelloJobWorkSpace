import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerWishGuard implements CanActivate {
  constructor(private userService: UserService, private snackBar: MatSnackBar, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const params = next.queryParams;
    if (!Object.keys(params).length) {
      return true;
    }
    if (this.userService.loaded.value) {
      const partner = this.userService.currentPartner.value;
      if (!localStorage.getItem('CURRENT_USER')) {
        this.snackBar.open('Bạn cần đăng nhập để xem thêm nội dung này', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        this.router.navigate(['/tai-khoan/dang-nhap'], { queryParams: { returnUrl: encodeURI(state.url) } });
        return false;
      } else if (partner && !partner.isCheck) {
        this.snackBar.open('Hello Job đang kiểm duyệt thông tin của bạn', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        this.router.navigate(['/lao-dong-tim-viec']);
        return false;
      } else if (partner) {
        return true;
      } else {
        this.snackBar.open('Bạn cần đăng ký đối tác để xem thêm nội dung này', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        this.router.navigate(['/lao-dong-tim-viec']);
        return false;
      }
    } else {
      this.userService.loaded.subscribe(loaded => {
        if (loaded) {
          const partner = this.userService.currentPartner.value;
          if (!localStorage.getItem('CURRENT_USER')) {
            this.snackBar.open('Bạn cần đăng nhập để xem thêm nội dung này', 'x', {
              panelClass: ['style-error'],
              duration: 2500
            });
            this.router.navigate(['/tai-khoan/dang-nhap'], { queryParams: { returnUrl: state.url } });
          } else if (partner && !partner.isCheck) {
            this.snackBar.open('Hello Job đang kiểm duyệt thông tin của bạn', 'x', {
              panelClass: ['style-error'],
              duration: 2500
            });
            this.router.navigate(['/lao-dong-tim-viec']);
          } else if (partner) {
            const nextUrl = encodeURI(state.url);
            this.router.navigateByUrl(state.url);
          } else {
            this.snackBar.open('Bạn cần đăng ký đối tác để xem thêm nội dung này', 'x', {
              panelClass: ['style-error'],
              duration: 2500
            });
            this.router.navigate(['/lao-dong-tim-viec']);
          }
        } else {
          return false;
        }
      });
    }
    return true;
  }

}
