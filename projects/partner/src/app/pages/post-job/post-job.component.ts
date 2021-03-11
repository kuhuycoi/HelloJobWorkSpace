import { OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var Tesseract;
declare var $:any;
import { JobProvinceService } from 'projects/tools/src/lib/services/job-province.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class PostJobComponent implements OnInit, AfterViewInit {
  @ViewChild('owl') owl: CarouselComponent;
  haveSubmited = false;
  websiteModules = [];
  websiteModuleData = [];
  selectedWebsiteModules = [];
  isEdit = false;
  requireGender = new FormControl(false);
  selectedBG = null;
  orderBackgrounds = [];
  gallery = [];
  galleryPreview = [];
  origin;
  galleryIndexUpload = [false, false, false, false, false];
  galleryFileUpload = [];
  selectedGalleryIndex = 0;
  invalidExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'mp4', 'avi', 'm4v', 'mpg'];
  imgExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
  currentlang = 'vi';
  customOptions: OwlOptions = {
    autoWidth: true,
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 200,
    smartSpeed: 0,
    fluidSpeed: false,
    navText: ['<span class="material-icons">arrow_back</span>', '<span class="material-icons">arrow_forward</span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 5
      }
    },
    nav: true
  }
  @ViewChildren('editContent') editContents: QueryList<ElementRef>;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    code: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    nameAscii: new FormControl(null),
    description: new FormControl(null),
    content: new FormControl(null),
    createdDate: new FormControl(null),
    lang: new FormControl(null),
    orderDisplay: new FormControl(null),
    seoDescription: new FormControl(null),
    seoKeyword: new FormControl(null),
    seoTitle: new FormControl(null),
    isHome: new FormControl(null),
    isHot: new FormControl(null),
    viewed: new FormControl(null),
    moduleIDs: new FormControl(null),
    moduleTypeCode: new FormControl(null),
    contentSource: new FormControl(null),
    contractQuantity: new FormControl(null),
    contractAddress: new FormControl(null),
    jobProvinceID: new FormControl(null),
    contractSalary: new FormControl(null),
    contractRequire: new FormControl(null),
    contractWelfare: new FormControl(null),
    contractTimeline: new FormControl(null),
    contractPartnerInfo: new FormControl(null),
    contractDate: new FormControl(null),
    orderContractID: new FormControl(null),
    partnerCompanyID: new FormControl(null),
    duration: new FormControl(null),
    contractSalaryExact: new FormControl(null),
    contractSalaryFrom: new FormControl(null),
    contractSalaryTo: new FormControl(null),
    urlApply: new FormControl(null),
    urlAvatar: new FormControl(null),
    phonenumber: new FormControl(null, [Validators.required, Validators.pattern(/^\+[\d]{6,}|0[\d]{9,10}$/)]),
    zaloContact: new FormControl(null),
    ageFrom: new FormControl(null),
    ageTo: new FormControl(null),
    heightFrom: new FormControl(null),
    heightTo: new FormControl(null),
    weightFrom: new FormControl(null),
    weightTo: new FormControl(null),
    isAdvance: new FormControl(true),
    isTraditional: new FormControl(false),
    contractQuantityFemale: new FormControl(null),
    contractQuantityMale: new FormControl(null),
    moneyAfterFly: new FormControl(2500),
    moneyBackOrigin: new FormControl(500),
    richTextWithBG: new FormControl(null),
    websiteOrderBackgroundID: new FormControl(null),
    examDate: new FormControl(null),
    contractQuantityJoin: new FormControl(null),
    contractQuantityJoinFemale: new FormControl(null),
    contractQuantityJoinMale: new FormControl(null),
    eyeSight: new FormControl(null),
    fancyHands: new FormControl(''),
    maritalStatus: new FormControl(''),
    notSmoking: new FormControl(null),
    notDrinking: new FormControl(null),
    expectedDepartureDate: new FormControl(null),
    examinationForm: new FormControl(''),
    syndicationName: new FormControl(null),
    factoryName: new FormControl(null),
    representative: new FormControl(null),
    companyAddress: new FormControl(null),
    careerSelectVisa: new FormControl(null),
    workInfo: new FormControl(null),
    experience: new FormControl(null),
    character: new FormControl(null),
    visitFamilyLabour: new FormControl(null),
    trainingAllowance: new FormControl(null),
    monthlySalary: new FormControl(null),
    workTime: new FormControl(null),
    hourlyWage: new FormControl(null),
    socialInsurance: new FormControl(null),
    workingHoursYear: new FormControl(null),
    taxesAndInsurance: new FormControl(null),
    holidaysOfYear: new FormControl(null),
    dormitoryExpenses: new FormControl(null),
    utilityCosts: new FormControl(null),
    realSalary: new FormControl(null),
    otherInfo: new FormControl(null),
    academicLevel: new FormControl(null),
    price: new FormControl(500),
    contractType: new FormControl(null),
    trainingRequired: new FormControl(null),
    orderRoadmap: new FormControl(null),
    preDeposit: new FormControl(0),
    flyDate: new FormControl(null),
    endFormDate: new FormControl(null),
    startFormDate: new FormControl(null),
    discount: new FormControl(3000),
    visaType: new FormControl(null),
  });
  advancePrice = new FormControl(false);
  fancyHandsList = [{ value: 'TAY_PHAI', text: 'rightHand' },
  { value: 'TAY_TRAI', text: 'leftHand' },
  { value: 'CA_HAI_TAY', text: 'allHand' }];

  contractTypeList = [{ value: 'TTS', text: 'student' },
  { value: 'KY_SU', text: 'engineer' },
  { value: 'KY_NANG_DAC_DINH', text: 'skillSpecial' },
  { value: 'HO_LY', text: 'assistant' }];
  jobProvinces = [];
  maritalStatusList = [
    { value: 'DOC_THAN', text: 'single' },
    { value: 'DA_KET_HON', text: 'married' },
    { value: 'LY_DI', text: 'divorce' }];

  characterList = [
    { value: 'NGOAN_NGOAN', text: 'NGOAN_NGOAN' },
    { value: 'HOAT_BAT', text: 'HOAT_BAT' },
    { value: 'KIEN_TRI', text: 'KIEN_TRI' },
    { value: 'BIET_NGHE_LOI', text: 'BIET_NGHE_LOI' },
    { value: 'NGHIEM_TUC', text: 'NGHIEM_TUC' },
    { value: 'KHOE_MANH', text: 'KHOE_MANH' },
    { value: 'KHEO_LEO', text: 'KHEO_LEO' },
    { value: 'KHONG_YEU_CAU', text: 'KHONG_YEU_CAU' },
  ];
  educationLevelList = [
    { value: 'THCS', text: 'education.THCS' }
    , { value: 'THPT', text: 'education.THPT' }
    , { value: 'TC', text: 'education.TC' }
    , { value: 'CD', text: 'education.CD' }
    , { value: 'DH', text: 'education.DH' }];

  examinationFormList = [
    { value: 'TIEN_CU', text: 'recommend' },
    { value: 'CHON_FORM', text: 'selectForm' },
    { value: 'PHONG_VAN_TRUC_TIEP', text: 'intervew' },
    { value: 'PHONG_VAN_ONLINE', text: 'online' }];

  trainingRequiredList = [
    { value: 'ONLINE_WITH_FEE', text: 'onlineWithFee' },
    { value: 'ONLINE_WITHOUT_FEE', text: 'onlineWithoutFee' },
    { value: 'STUDY_AT_CENTER', text: 'studyAtCenter' }];

  orderRoadmapList = [
    { value: 'RECEIVE_FORM', text: 'receiveForm' },
    { value: 'EXAMINATION', text: 'examination' },
    { value: 'RECEIVE_RECORD', text: 'receiveRecord' },
    { value: 'EDUCATE', text: 'educate' },
    { value: 'APPLY_VISA', text: 'applyVisa' }];

  file = new FormControl();
  fileName = '';
  previewUrl = '/assets/img/noimg.png';
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  constructor(
    private jobProvinceService: JobProvinceService,
    private route: ActivatedRoute,
    private publicService: PublicService,
    private userService: UserService,
    private router: Router,
    private adapter: DateAdapter<any>,
    private snackBar: MatSnackBar,
    private translateService: TranslateService) {
  }
  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.advancePrice.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('discount').setValue(3000);
        this.form.get('moneyBackOrigin').setValue(500);
        this.form.get('price').setValue(500);
        this.form.get('moneyAfterFly').setValue(2500);
        this.form.get('discount').disable();
      } else {
        this.form.get('moneyBackOrigin').setValue(0);
        this.form.get('price').setValue(0);
        this.form.get('moneyAfterFly').setValue(0);
        this.form.get('discount').enable();
      }
    });
    this.form.get('moneyBackOrigin').valueChanges.subscribe(() => this.updateDiscount());
    // this.form.get('price').valueChanges.subscribe(() => this.updateDiscount());
    this.form.get('moneyAfterFly').valueChanges.subscribe(() => this.updateDiscount());

    this.publicService.findAllWebsiteModule({ lang: 'vi', haveROOT: false }).subscribe((res: ResponseApi) => {
      this.websiteModuleData = res.data;
    });
    this.currentlang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(data => {
      this.currentlang = data.lang;
    });
    this.publicService.findAllOrderContractGroup().subscribe((res: ResponseApi) => {
      res.data.filter(item => item.parentID === 1).forEach(item => {
        const option = Object.assign({}, item);
        option.childs = res.data.filter(childItem => childItem.parentID === item.id);
        this.websiteModules.push(option);
      });
    });
    const id = this.route.snapshot.params.id;
    if (id) {
      this.f.id.setValue(id);
      this.isEdit = true;
    } else {
      this.userService.websiteOrderContractMakeCode().subscribe((res: ResponseApi) => {
        this.f.code.setValue(res.data);
      });
    }
    this.publicService.findAllOrderBackground().subscribe((res: ResponseApi) => {
      if (res) {
        this.orderBackgrounds = res.data;
        if (this.isEdit && this.f.websiteOrderBackgroundID.value) {
          const bg = this.orderBackgrounds.find(item => item.id === this.f.websiteOrderBackgroundID.value.id);
          this.f.websiteOrderBackgroundID.setValue(bg);
        }
      }
    });
    this.adapter.setLocale('vi');
    this.f.websiteOrderBackgroundID.valueChanges.subscribe(value => {
      if (value === null) {
        this.f.richTextWithBG.setValue(null);
        this.f.richTextWithBG.setValidators(null);
        this.previewUrl = '/assets/img/noimg.png';
      } else {
        if ($('#editContent').length) {
          $('#editContent').trigger('focus');
        }
        this.f.richTextWithBG.setValidators([Validators.required]);
      }
    });
    this.jobProvinceService.findAllAvaiable('ja').subscribe((resProvince: ResponseApi) => {
      this.jobProvinces = resProvince.data;
      if (this.isEdit) {
        this.userService.findOneWebsiteOrderContract(this.f.id.value).subscribe((res: ResponseApi) => {
          if (res.success) {
            if (res.data == null) {
              location.href = '/';
            } else {
              if (res.data.isGallery) {
                this.gallery = res.data.gallery;
                res.data.gallery.forEach(gal => {
                  this.galleryPreview.push({ url: localStorage.getItem('ServerUrl') + gal.url, fileType: gal.type, isOld: true });
                });
              }
              if (res.data.contractQuantityFemale || res.data.contractQuantityMale) {
                this.requireGender.setValue(true);
              }
              if (res.data.moduleIDs) {
                res.data.moduleIDs = res.data.moduleIDs.split(',').filter(item => item !== '').map(item => {
                  return parseInt(item, 10);
                });
              }
              if (res.data.character) {
                res.data.character = res.data.character.split(',').filter(item => item !== '').map(item => {
                  return item;
                });
              }
              this.setFormValue(res.data);
              if (this.form.get('jobProvinceID').value && this.jobProvinces.length) {
                const oldID = this.form.get('jobProvinceID').value.id;
                const oldProvince = this.jobProvinces.find(item => item.id === oldID);
                this.form.get('jobProvinceID').setValue(oldProvince);
              }
              if (!res.data.code) {
                this.userService.websiteOrderContractMakeCode().subscribe((resC: ResponseApi) => {
                  this.f.code.setValue(resC.data);
                });
              }
              if (this.f.websiteOrderBackgroundID.value && this.orderBackgrounds.length) {
                const bg = this.orderBackgrounds.find(item => item.id === this.f.websiteOrderBackgroundID.value.id);
                this.f.websiteOrderBackgroundID.setValue(bg);
              } else if (res.data.urlAvatar) {
                this.previewUrl = localStorage.getItem('ServerUrl') + res.data.urlAvatar;
              }
            }
          }
        });
      } else {
        const partner = this.userService.currentPartner.value;
        if (partner) {
          this.f.contractPartnerInfo.setValue(partner.description);
          this.f.phonenumber.setValue(partner.mobile);
          this.f.zaloContact.setValue(partner.zaloContact);
        }
      }
    });
    // this.f.richTextWithBG.valueChanges.subscribe(value => {
    //   if ($('#editContent').length) {
    //     $('#editContent').css('height', '');
    //     $('#editContent').height($('#editContent')[0].scrollHeight);
    //   }
    // });
  }
  // get lastIndexPreview() {
  //   return Array(this.galleryPreview.length>).fill(1).map((x, i) => i + 1);
  // }
  updateDiscount() {
    if (this.advancePrice.value) {
      const discount = this.form.get('moneyBackOrigin').value + this.form.get('moneyAfterFly').value;
      this.form.get('discount').setValue(discount);
    }
  }
  setFormValue(data?: any) {
    this.form.setValue(CommonUtils.copyProperties(this.form.value, data));
  }
  // findGroupContractbyParentID(parentID) {
  //   return this.websiteModules.filter(item => item.parentID === parentID);
  // }
  ngAfterViewInit() {
    this.editContents.changes.subscribe(() => {
      $('#editContent').height($('#editContent')[0].scrollHeight);
    });
  }

  isChecked(id) {
    const checkedModules = this.f.moduleIDs.value;
    return checkedModules && checkedModules.indexOf(',' + id + ',') >= 0;
  }
  get localStorage() {
    return localStorage;
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      const url = event.target.value;
      // this.fileName = selectedFile.name + ' - ' + parseInt((selectedFile.size / 1024).toString(), 10) + 'kb';
      this.file.setValue(selectedFile);
      const worker = new Tesseract.TesseractWorker();
      worker.recognize(selectedFile, 'vie')
        .then(data => {
          if (data && data.text) {
            // if (!this.f.name.value) {
            //   this.f.name.setValue(data.text);
            // }
            this.f.richTextWithBG.setValue(data.text);
          }
        });
      const ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      if ((ext === 'png' || ext === 'jpeg' || ext === 'jpg')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.previewUrl = e.target.result.toString();
        };
        reader.readAsDataURL(selectedFile);
      } else {
        this.previewUrl = '/assets/img/noimg.png';
      }
    }
  }
  changeOrderBG(item) {
    if (item !== this.f.websiteOrderBackgroundID.value) {
      this.f.websiteOrderBackgroundID.setValue(item);
      this.file.setValue(null);
      $('#attachFile').val(null);
    }
  }

  getError(control) {
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName)) {
        if (control.hasError('required')) {
          return 'Vui lòng nhập trường này';
        } else if (control.hasError('pattern')) {
          return 'Không đúng định dạng';
        } else {
          return 'Vui lòng nhập lại';
        }
      }
    }
    return undefined;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.requireGenderChange();
    this.form.get('discount').enable();
    const formData = new FormData();
    const form = this.form.value;
    if (form.moduleIDs == null) {
      // if (form.moduleIDs.indexOf(4) < 0) {
      form.moduleIDs = [];
      form.moduleIDs.push(4);
      // }
    }
    form.moduleIDs = ',' + form.moduleIDs.join(',') + ',';
    if (form.character) {
      form.character = ',' + form.character.join(',') + ',';
    }
    form.nameAscii = '/' + removeUnicode(form.name, '-', false);
    formData.append('langCode', this.currentlang);
    formData.append('websiteOrderContract', new Blob([JSON.stringify(form)], {
      type: 'application/json;charset=UTF-8',
    }));
    if (!this.advancePrice.value) {
      this.form.get('discount').disable();
    }
    if (this.file.value && !this.f.websiteOrderBackgroundID.value) {
      formData.append('file', this.file.value);
    }
    this.galleryFileUpload.forEach((item, index) => {
      const name = index.toString() + '#-#' + item.type + '.' + item.ext;
      formData.append('gallery', item.file, name);
    });
    if (!this.isEdit) {
      this.userService.websiteOrderContractInsert(formData).subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          if (this.currentlang !== 'vi') {
            this.userService.translateWebsiteOrderContractToVI(formData).subscribe((res1: ResponseApi) => { });
          }
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500
          });
        }
        return;
      });
    } else {
      if (this.galleryPreview.length) {
        for (let i = 0; i < this.galleryPreview.length; i++) {
          const ga = this.galleryPreview[i];
          ga.index = i;
          if (ga.isOld) {
            ga.url = ga.url.replace(this.localStorage.getItem('ServerUrl'), '');
          } else {
            ga.url = 'URL';
          }
        }
        formData.append('galleryPreview', new Blob([JSON.stringify(this.galleryPreview)], {
          type: 'application/json;charset=UTF-8',
        }));
      }
      // console.log(this.form.get('trainingRequired').value)
      this.userService.websiteOrderContractEdit(formData).subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          this.router.navigate(['/doi-tac/don-hang-da-dang']);
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500
          });
        }
      });
    }
  }
  changeGalleryItem() {
    // this.selectedGalleryIndex = index;
    $('#attachGalleryFile').click();
  }
  deleteGalleryItem() {
    this.galleryPreview.splice(this.selectedGalleryIndex, 1);
    this.galleryFileUpload.splice(this.selectedGalleryIndex, 1);
  }
  get invalidExtStr() {
    return this.invalidExt.join(', ');
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
      if (this.invalidExt.indexOf(ext) > -1) {
        this.galleryIndexUpload[this.selectedGalleryIndex] = true;
        const fileUpload: { file?: any, type?: 'img' | 'video', ext?: string } = {};
        fileUpload.file = selectedFile;
        if (this.imgExt.indexOf(ext) > -1) {
          fileUpload.type = 'img';
          const reader = new FileReader();
          reader.onload = (e) => {
            this.galleryPreview.splice(this.selectedGalleryIndex, 1,
              { url: e.target.result.toString(), fileType: fileUpload.type, isOld: false });
          };
          reader.readAsDataURL(selectedFile);
        } else {
          fileUpload.type = 'video';
          this.galleryPreview.splice(this.selectedGalleryIndex, 1,
            { url: '/assets/img/video-icon.png', fileType: fileUpload.type, isOld: false });
        }
        fileUpload.ext = ext;
        this.galleryFileUpload.splice(this.selectedGalleryIndex, 1, fileUpload);
        console.log(this.owl)
      } else {
        this.snackBar.open('Định dạng file không hợp lệ', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    }
  }

  matchGender() {
    if (this.requireGender.value) {
      const contractQuantityFemale = parseInt(this.f.contractQuantityFemale.value ? this.f.contractQuantityFemale.value : 0, 10);
      const contractQuantityMale = parseInt(this.f.contractQuantityMale.value ? this.f.contractQuantityMale.value : 0, 10);
      const contractQuantityJoinFemale =
        parseInt(this.f.contractQuantityJoinFemale.value ? this.f.contractQuantityJoinFemale.value : 0, 10);
      const contractQuantityJoinMale = parseInt(this.f.contractQuantityJoinMale.value ? this.f.contractQuantityJoinMale.value : 0, 10);
      this.f.contractQuantity.setValue(contractQuantityFemale + contractQuantityMale);
      this.f.contractQuantityJoin.setValue(contractQuantityJoinFemale + contractQuantityJoinMale);
    }
  }
  requireGenderChange() {
    if (!this.requireGender.value) {
      this.f.contractQuantityFemale.setValue(null);
      this.f.contractQuantityMale.setValue(null);
      this.f.contractQuantityJoinFemale.setValue(null);
      this.f.contractQuantityJoinMale.setValue(null);
    }
  }
}
