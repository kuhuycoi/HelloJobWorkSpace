import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataHelperService {
    totalNotification: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    event: BehaviorSubject<any> = new BehaviorSubject<any>(false);
}
