import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class AnnouncerService {
    constructor(private _snackBar: MatSnackBar) { }
    
    alert(message: string, action: string = "Thông báo", duration = 2000) {
        this._snackBar.open(message, action, {
            duration: duration,
        });
    }
}