import { HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from 'projects/tools/src/lib/services/spinner.service';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private router: Router, private loaderService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let reqHeaders: HttpHeaders = req.headers;
    try {
      if (!req.url.toLowerCase().endsWith('/auth') && !req.url.toLowerCase().startsWith('./assets')
        && localStorage.CURRENT_USER) {
        const session = localStorage.CURRENT_USER;
        if (!reqHeaders) {
          reqHeaders = new HttpHeaders();
        }
        reqHeaders = reqHeaders.set('Authorization', session);
      }
    } catch (err) {

    }
    const changedReq = req.clone({ headers: reqHeaders });
    this.requests.push(changedReq);
    if (!this.loaderService.isLoading.value) {
      this.loaderService.isLoading.next(true);
    }
    return new Observable(observer => {
      const subscription = next.handle(changedReq)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(changedReq);
              if (event.body && event.body.code === -9999) {
                localStorage.removeItem('CURRENT_USER');
                location.href = '/';
                subscription.unsubscribe();
              } else {
                observer.next(event);
              }
            }
          },
          err => {
            this.removeRequest(changedReq); observer.error(err);
          }, () => {
            this.removeRequest(changedReq); observer.complete();
          });
      // teardown logic in case of cancelled requests
      return () => {
        this.removeRequest(changedReq);
        subscription.unsubscribe();
      };
    });
  }
  public removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    this.requests.splice(i, 1);
    this.loaderService.isLoading.next(this.requests.length > 0);
  }
}
