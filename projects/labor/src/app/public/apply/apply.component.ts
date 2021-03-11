import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataHelperService } from 'projects/tools/src/lib/services/data-helper.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {
  isLoggedIn = false;
  listCvApply = [];
  isChooseCV = true;
  id;
  orderContract;
  haveSubmited = false;
  currentCustomer;
  fileExtensionAccept = true;
  form = new FormGroup({
    fullname: new FormControl(null, [Validators.required]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\+[\d]{6,}|0[\d]{9,10}$/),
    ]),
    // tslint:disable-next-line: max-line-length
    email: new FormControl(null, [
      Validators.pattern(
        /^((([^#<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}));{0,1})+$/
      ),
    ]),
    address: new FormControl(null),
    content: new FormControl('Tôi muốn ứng tuyển đơn hàng này', [
      Validators.required,
    ]),
    originalFileName: new FormControl(''),
    urlCV: new FormControl(''),
  });
  fileSize;
  file = new FormControl(null, [Validators.required]);
  get fullname() {
    return this.form.get('fullname');
  }
  get mobile() {
    return this.form.get('mobile');
  }
  get email() {
    return this.form.get('email');
  }
  get address() {
    return this.form.get('address');
  }
  get content() {
    return this.form.get('content');
  }
  get localStorage() {
    return localStorage;
  }
  get originalFileName() {
    return this.form.get('originalFileName');
  }
  get urlCV() {
    return this.form.get('urlCV');
  }
  constructor(
    private dataHelperService: DataHelperService,
    private route: ActivatedRoute,
    private publicService: PublicService,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.titleService.setTitle('Hello Job | Ứng tuyển');
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.paging();
    });
    if (localStorage.getItem('CURRENT_USER')) {
      this.isLoggedIn = true;
      this.userService.getListCvApply().subscribe((res: ResponseApi) => {
        this.listCvApply = res.data;
      });
    }
    userService.currentCustomer.subscribe((cus) => {
      if (cus != null) {
        this.currentCustomer = cus;
        this.file.setValidators([]);
        this.fullname.setValue(cus.fullName);
        this.mobile.setValue(cus.phonenumber);
        this.email.setValue(cus.email);
      }
    });
  }
  getError(control: AbstractControl) {
    if (control.hasError('required')) {
      return 'Vui lòng nhập trường này';
    } else if (control.hasError('pattern')) {
      return 'Định dạng không đúng';
    }
  }

  ngOnInit() {}

  paging() {
    this.publicService.detail(this.id).subscribe((res: ResponseApi) => {
      this.orderContract = res.data;
      this.titleService.setTitle(
        'Hello Job | Ứng tuyển ' + this.orderContract.name
      );
    });
  }

  public onSubmit() {
    this.haveSubmited = true;
    if (!this.checkExtension(this.file)) {
      return;
    }
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    const form = this.form.value;
    form.website_OrderContractID = this.orderContract;
    formData.append(
      'recruiment',
      new Blob([JSON.stringify(form)], {
        type: 'application/json',
      })
    );
    formData.append('file', this.file.value);
    this.publicService.uploadCV(formData).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
        this.dataHelperService.totalNotification.next(true);
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      }
    });
  }

  onFileChange(event, control) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      this.originalFileName.setValue(selectedFile.name);
      this.fileSize = parseInt((selectedFile.size / 1024).toString(), 10);
      control.setValue(selectedFile);
    }
    this.checkExtension(this.file);
  }

  private checkExtension(c) {
    if (c.value) {
      const valToLower = c.value.name.toLowerCase();
      const regex = new RegExp('(.*?).(jpg|png|jpeg|doc|docx|pdf)$'); // add or remove required extensions here
      this.fileExtensionAccept = regex.test(valToLower);
      return this.fileExtensionAccept;
    }
    return true;
  }
  onSelectionChange(item) {
    if (item) {
      this.isChooseCV = false;
      this.originalFileName.setValue(item.originalFileName);
      this.urlCV.setValue(item.urlCV);
    } else {
      this.isChooseCV = true;
      this.originalFileName.setValue(null);
      this.urlCV.setValue(null);
    }
  }
}
