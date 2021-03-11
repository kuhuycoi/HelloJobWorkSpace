import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ImageElementContainer } from 'html2canvas/dist/types/dom/replaced-elements/image-element-container';
import { PartnerCompany } from 'projects/tools/src/lib/types/partner-company';
import { SpinnerService } from 'projects/tools/src/lib/services/spinner.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-partner-info',
  templateUrl: './partner-info.component.html',
  styleUrls: ['./partner-info.component.scss']
})
export class PartnerInfoComponent implements OnInit {
  isFirst = true;
  haveSubmited = false;
  returnUrl;
  fileExtensionAccept = true;
  // public editor = CustomEditor;
  @ViewChild('avatar') previewImg: ElementRef;
  partner: PartnerCompany;
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    nameJapan: new FormControl(null),
    address: new FormControl(null),
    urlAvartar: new FormControl(null),
    mobile: new FormControl(null, [Validators.required, Validators.pattern(/^\+[\d]{6,}|0[\d]{9,10}$/)]),
    // tslint:disable-next-line: max-line-length
    email: new FormControl(null, [Validators.pattern(/^((([^#<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}));{0,1})+$/)]),
    content: new FormControl(null),
    description: new FormControl(null),
    originalFileName: new FormControl(''),
    zaloContact: new FormControl(null),
    websiteLink: new FormControl(null),
    isPublicPhonenumber: new FormControl(null),
  });
  file = new FormControl();

  get name() {
    return this.form.get('name');
  }
  get code() {
    return this.form.get('code');
  }
  get nameJapan() {
    return this.form.get('nameJapan');
  }
  get address() {
    return this.form.get('address');
  }
  get urlAvartar() {
    return this.form.get('urlAvartar');
  }
  get mobile() {
    return this.form.get('mobile');
  }
  get email() {
    return this.form.get('email');
  }
  get content() {
    return this.form.get('content');
  }
  get description() {
    return this.form.get('description');
  }
  get originalFileName() {
    return this.form.get('originalFileName');
  }
  get websiteLink() {
    return this.form.get('websiteLink');
  }
  get zaloContact() {
    return this.form.get('zaloContact');
  }

  getError(control) {
    if (control.hasError('required')) {
      return 'Vui lòng nhập trường này';
    } else if (control.hasError('pattern')) {
      return 'Không đúng định dạng';
    } else {
      return 'Vui lòng nhập lại';
    }
  }

  get localStorage() {
    return localStorage;
  }

  // get captcha() {
  //   return this.form.get('captcha');
  // }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar, private titleService: Title) {
    titleService.setTitle('Hello Job | Cập nhật thông tin nhà môi giới');
    this.mobile.valueChanges.subscribe(x => {
      if (this.isFirst) {
        this.zaloContact.setValue(x);
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params.returnUrl) {
        this.returnUrl = decodeURIComponent(params.returnUrl);
      }
      return;
    });
    const cus = this.userService.currentCustomer.value;
    const partner = this.userService.currentPartner.value;
    if (partner) {
      this.isFirst = false;
      this.partner = partner;
      this.name.setValue(this.partner.name);
      this.nameJapan.setValue(this.partner.nameJapan);
      this.address.setValue(this.partner.address);
      this.urlAvartar.setValue(this.partner.urlAvartar);
      this.mobile.setValue(this.partner.mobile);
      this.email.setValue(this.partner.email);
      this.content.setValue(this.partner.content);
      this.description.setValue(this.partner.description);
      this.originalFileName.setValue(this.partner.originalFileName);
      this.zaloContact.setValue(this.partner.zaloContact);
      this.websiteLink.setValue(this.partner.websiteLink);
      this.code.setValue(this.partner.code);
    } else if (cus) {
      this.mobile.setValue(cus.phonenumber);
      this.email.setValue(cus.email);
      this.address.setValue(cus.address);
    }
  }

  ngOnInit(): void {
    if (!this.partner || !this.partner.isCheck) {
      this.name.valueChanges.subscribe(x => {
        this.code.setValue(removeUnicode(x, '', true));
      });
    } else {
      this.code.disable();
    }
  }
  public onSubmit() {
    this.haveSubmited = true;
    if (this.form.invalid) {
      return;
    }
    const partner: PartnerCompany = this.form.value;
    const formData = new FormData();
    formData.append('partner', new Blob([JSON.stringify(partner)], {
      type: 'application/json;charset=UTF-8',
    }));
    formData.append('file', this.file.value);
    this.userService.saveOrUpdatePartnerCompany(formData).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.userService.getPartnerCompany().subscribe((partnerRes: ResponseApi) => {
          if (partnerRes) {
            this.userService.currentPartner.next(partnerRes.data);
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            }
          }
        });
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
      return;
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      const checkfileType = this.checkExtension(selectedFile);
      if (!checkfileType) {
        this.snackBar.open('Chỉ chấp nhận định dạng ảnh png, jpg, jpeg', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        return;
      }
      if (selectedFile.size > 2097152) {
        this.snackBar.open('Ảnh có kích thước phải nhỏ hơn 2MB', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        return;
      }
      const reader = new FileReader();
      const imgPreview = this.previewImg.nativeElement as ImageElementContainer;
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        imgPreview.src = reader.result.toString();
      };
      this.originalFileName.setValue(selectedFile.name + ' - ' + parseInt((selectedFile.size / 1024).toString(), 10) + 'kb');
      this.file.setValue(selectedFile);
    }
  }

  private checkExtension(f) {
    if (f) {
      const valToLower = f.name.toLowerCase();
      const regex = new RegExp('(.*?)\.(jpg|png|jpeg)$'); // add or remove required extensions here
      this.fileExtensionAccept = regex.test(valToLower);
      return this.fileExtensionAccept;
    }
    return true;
  }

}
