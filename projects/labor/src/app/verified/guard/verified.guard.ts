import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (!localStorage.getItem('CURRENT_USER')) {
      this.router.navigate(['/tai-khoan/dang-nhap'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
}
