import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.scss'],
})
export class ProfileNavComponent implements OnInit {
  @Input() currentCustomer;
  @Input() activeText;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  get localStorage() {
    return localStorage;
  }

  updateAvatar(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      event.target.value = '';
      const checkfileType = this.checkExtension(selectedFile);
      if (!checkfileType) {
        this.snackBar.open('Chỉ chấp nhận định dạng ảnh png, jpg, jpeg', 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
        return;
      }
      if (selectedFile.size > 2097152) {
        this.snackBar.open('Ảnh có kích thước phải nhỏ hơn 2MB', 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      this.userService.updateAvatar(formData).subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500,
          });
          this.currentCustomer.urlAvatar = res.data;
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500,
          });
        }
      });
    }
  }

  private checkExtension(f) {
    if (f) {
      const valToLower = f.name.toLowerCase();
      const regex = new RegExp('(.*?).(jpg|png|jpeg)$'); // add or remove required extensions here
      return regex.test(valToLower);
    }
    return true;
  }
}
