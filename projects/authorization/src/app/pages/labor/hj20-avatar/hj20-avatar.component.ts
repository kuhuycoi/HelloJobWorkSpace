import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

@Component({
  selector: 'app-hj20-avatar',
  templateUrl: './hj20-avatar.component.html',
  styleUrls: ['./hj20-avatar.component.scss']
})
export class Hj20AvatarComponent implements OnInit {
  public identifier: string = 'anh-dai-dien';
  imgExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
  public previewUrl;
  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private snackBar: MatSnackBar
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    if (this.service.userInfo.avatar) {
      this.previewUrl = this.service.userInfo.avatar;
    }
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  public validate() {
    return this.previewUrl;
  }

  public moveNext() {
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.avatar = this.previewUrl;
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }
  onChangeImage(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      if (selectedFile.size > 10485760) {
        this.snackBar.open('Kích thước ảnh/video không được lớn hơn 10 MB', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        return;
      }
      const url = event.target.value;
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      if (this.imgExt.indexOf(ext) > -1) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      } else {
        this.snackBar.open('Định dạng file không hợp lệ', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    }
  }
}
