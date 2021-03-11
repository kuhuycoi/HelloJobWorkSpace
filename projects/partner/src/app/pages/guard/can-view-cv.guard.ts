import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { RoutingStateService } from 'projects/tools/src/lib/services/routing-state.service';

@Injectable({
  providedIn: 'root',
})
export class CanViewCvGuard implements CanActivate {
  constructor(
    private publicService: PublicService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private routingStateService: RoutingStateService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const cusID = next.params.id;
    return this.checkCanViewCV(cusID);
  }
  async checkCanViewCV(cusID) {
    const res: ResponseApi = await this.publicService
      .checkCanViewCV(cusID)
      .toPromise();
    if (!res || !res.success || !res.data) {
      this.snackBar.open(
        'CV của lao động này không được chia sẻ với bạn',
        'x',
        {
          panelClass: ['style-error'],
          duration: 2500,
        }
      );
      if (!this.routingStateService.history.length) {
        this.router.navigateByUrl('/');
      }
      return false;
    }
    return true;
  }
}
