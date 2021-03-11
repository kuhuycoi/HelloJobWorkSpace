import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { startWith, map, } from 'rxjs/operators';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectIframeComponent } from './select-iframe/select-iframe.component';
declare var $:any;
import { VocabularyUsing } from 'projects/tools/src/lib/types/vocabulary-using';
import { CustomFormControl } from 'projects/tools/src/lib/types/custom-form-control';
import { Customer } from 'projects/tools/src/lib/types/customer';
import { AudioRecording } from 'projects/tools/src/lib/utils/audio-recording';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MicOverlayComponent } from 'projects/tools/src/lib/components/mic-overlay/mic-overlay.component';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';

@Component({
  selector: 'app-register-referral',
  templateUrl: './register-referral.component.html',
  styleUrls: ['./register-referral.component.scss']
})
export class RegisterReferralComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hiddenLink', { static: false }) hiddenLink: ElementRef;
  loaded = false;
  vocabularies: VocabularyUsing[] = [];
  galleryPreview = [];
  selectedGalleryIndex = 0;
  galleryFileUpload = [];
  provinceQuestionKey = ['44', '9'];
  customOptions: OwlOptions = {
    autoWidth:true,
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
  suggestions: {
    id?: string;
    vocabularyID?: number;
    parentID?: string;
    content?: string;
  }[];
  answers: { [key: string]: any } = {};
  form: FormGroup = new FormGroup({});
  formControls: CustomFormControl[] = [];
  questionTableIndexs = [];
  questionAttachIndexs = [];
  seconds;
  selectedVoiceFormControl: CustomFormControl;
  isRecording = false;
  recordedTime;
  registeredCustomer;
  selectedIndex = 0;
  customerID;
  isEdit = false;
  selectedReferral: Customer;
  isPublicPhonenumber = new FormControl(false);
  price = new FormControl(null);
  moneyBackOrigin = new FormControl(null);
  moneyAfterFly = new FormControl(null);
  createdDate = new FormControl(null);
  timePass = new FormControl(null);
  audioRecording = new AudioRecording();
  provinces = [];
  invalidExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'mp4', 'avi', 'm4v', 'mpg'];
  galleryIndexUpload = [false, false, false, false, false];
  imgExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
  constructor(
    private publicService: PublicService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
    this.userService.activeBottomNav.next(2);
    this.publicService.getListProvince().subscribe((res: ResponseApi) => {
      this.provinces = res.data;
    });
    this.route.params.subscribe(param => {
      if (param.id) {
        try {
          this.customerID = parseInt(param.id, 10);
        } catch (err) { }
      }
      this.changeFormStructure();
    });
    this.audioRecording.recordingFailed().subscribe((error) => {
      if (error) {
        this.isRecording = false;
        this.snackBar.open('Thiết bị của bạn không hộ trợ ghi âm', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    });
    this.audioRecording.getRecordedTime().subscribe((time) => {
      if (time === '00:00') {
        const micOverlay = this.dialog.open(MicOverlayComponent, {
          width: '300px',
          height: '250px',
          maxWidth: '100%',
        });
        micOverlay.afterClosed().subscribe(() => {
          this.isRecording = false;
          // clearInterval(this.intervalHold);
          this.seconds = 0;
          setTimeout(() => {
            this.audioRecording.stopRecording();
          }, 500);
        });
      }
      this.recordedTime = time;
    });

    this.audioRecording.getRecordedBlob().subscribe((data) => {
      if (data) {
        const blob = data.blob;
        const formData = new FormData();
        formData.append('attachFile', blob, data.title);
        this.publicService.speechToText(formData).subscribe((res: ResponseApi) => {
          if (!res) {
            return;
          }
          const transcript = res.data;
          this.selectedVoiceFormControl.setValue(transcript);
          this.selectedVoiceFormControl = null;
          this.seconds = 0;
        });
      }
    });
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
  }
  isProvinceQuestion(indexkey) {
    return this.provinceQuestionKey.indexOf(indexkey) > -1;
  }
  get selectedControl() {
    return (this.selectedIndex <= this.formControls.length - 1) ? this.formControls[this.selectedIndex] : null;
  }
  nextStep() {
    if (this.selectedControl.invalid || this.selectedIndex === this.formControls.length) {
      return;
    }
    this.selectedIndex++;
  }
  prevStep() {
    this.selectedIndex--;
  }
  changeFormStructure() {
    this.userService
      .findAllCVQuestionsAndAnswers(this.customerID).subscribe((res: ResponseApi) => {
        const data = res.data;
        if (data.CUSTOMER) {
          if (data.CUSTOMER.isGallery) {
            data.GALLERY.forEach(gal => {
              if (gal.type === 'iframe') {
                this.galleryPreview.push({ url: gal.url, fileType: gal.type, isOld: true });
              } else {
                this.galleryPreview.push({ url: localStorage.getItem('ServerUrl') + gal.url, fileType: gal.type, isOld: true });
              }
            });
          }
          this.isPublicPhonenumber.setValue(data.CUSTOMER.isPublicPhonenumber);
          this.price.setValue(data.CUSTOMER.price);
          this.moneyAfterFly.setValue(data.CUSTOMER.moneyAfterFly);
          this.moneyBackOrigin.setValue(data.CUSTOMER.moneyBackOrigin);
          if (data.CUSTOMER.createdDate) {
            this.createdDate.setValue(moment(data.CUSTOMER.createdDate));
          }
          if (data.CUSTOMER.currentTimePass) {
            this.timePass.setValue(moment(data.CUSTOMER.currentTimePass));
          }
        }
        this.answers = data.ANSWERS;
        this.suggestions = data.SUGGESTIONS;
        this.vocabularies = data.QUESTIONS;
        const tableAns = data.ANSWERS_TABLE;
        this.formControls = [];
        const formControls = {};
        this.vocabularies.filter(question => question.isBasicInfo && question.vocabularyUsingTypeID
          && !question.parentIndexKey
          && question.vocabularyUsingTypeID.code !== 'TEXT')
          .forEach((element: VocabularyUsing) => {
            const formControl = new CustomFormControl(null);
            formControl.indexkey = element.indexKey;
            formControl.question = element;
            formControl.required = element.isRequired;
            formControl.suffix = element.suffix;
            formControl.prefix = element.prefix;
            formControl.placeholder = element.vocabularyID.content;
            formControl.usingType = element.vocabularyUsingTypeID;
            formControl.hint = element.hint;
            const ans = this.answers[element.indexKey] ? this.answers[element.indexKey].content : null;
            if (element.isEditable || typeof ans === 'undefined'
              || ans == null) {
              element.isEditable = true;
            }
            formControl.isEditable = element.isEditable;
            if (element.isRequired) {
              formControl.setValidators([Validators.required]);
            }
            if (element.answers) {
              formControl.answers = element.answers.split('##');
            }
            const controlKey = element.indexKey + '##' + (element.vocabularyID ? element.vocabularyID.id.toString() : '') +
              '##' + element.vocabularyUsingTypeID.code +
              '##' + element.isSuggestion;
            if (element.isSuggestion) {
              formControl.suggestions = this.suggestions
                .filter(suggestion => element.vocabularyID && element.vocabularyID.id === suggestion.vocabularyID);
              formControl.filteredSuggestions = formControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => this._filter(formControl))
                );
            }
            if (formControl.usingType && formControl.usingType.code === 'QUESTION_TABLE') {
              this.questionTableIndexs.push(controlKey);
              formControl.columns = this.vocabularies.filter(item => item.parentIndexKey === element.indexKey);
              const value = [];
              const totalRow = this.answers[element.indexKey] ? this.answers[element.indexKey].totalRow : 0;
              for (let i = 0; i < totalRow; i++) {
                const currentTableAns = {};
                tableAns.filter(item => item.parentIndexKey === element.indexKey && item.answerOrder === i)
                  .forEach(item => {
                    const column = formControl.columns.find(cur => cur.indexKey === item.indexKey);
                    const cellControlKey = item.indexKey + '##' + column.vocabularyID.id.toString() +
                      '##' + column.vocabularyUsingTypeID.code +
                      '##' + column.isSuggestion;
                    currentTableAns[cellControlKey] = item.content;
                  });
                value.push(currentTableAns);
              }
              formControl.setValue(value);
            } else if (formControl.usingType && formControl.usingType.code === 'QUESTION_ATTACH') {
              this.questionAttachIndexs.push(controlKey);
            } else if (formControl.usingType && formControl.usingType.code === 'QUESTION_DATE' && ans) {
              const date = moment(ans, 'DD/MM/YYYY').toDate();
              formControl.setValue(date);
            } else {
              formControl.setValue(ans);
            }
            formControls[controlKey] = formControl;
            this.formControls.push(formControl);
          });
        this.form = new FormGroup(formControls);
        // this.
      });
  }

  changeGalleryItem() {
    const index = this.selectedGalleryIndex;
    if (this.galleryPreview[index]) {
      if (this.galleryPreview[index].fileType === 'iframe') {
        this.selectIframe();
      } else {
        $('#attachGalleryFile').click();
      }
    } else {
      $('#attachGalleryFile').click();
    }
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
      // debugger;
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
      } else {
        this.snackBar.open('Định dạng file không hợp lệ', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    }
  }
  private _filter(formControl: CustomFormControl) {
    const filterValue = formControl.value ? formControl.value.toLowerCase() : null;
    return formControl.suggestions.filter(item => {
      return (item.content && removeUnicode(item.content.toLowerCase()).includes(removeUnicode(filterValue)));
    });
  }
  getErrorMessage(formControl) {
    return 'Vui lòng nhập trường này';
  }
  checkboxChange(item: CustomFormControl, value, isChecked) {
    const values: string[] = item.value ? item.value.split(', ', -1) : [];
    if (isChecked) {
      values.push(value);
    } else {
      const index = values.indexOf(value);
      if (index >= 0) {
        values.splice(index, 1);
      }
    }
    item.setValue(values.join(', '));
  }
  isChecked(elm, value) {
    const values: string[] = value ? value.split(', ', -1) : [];
    return values.indexOf(elm) > -1;
  }

  onFileChange(event, control) {
    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].size > 209715200) {
        this.snackBar.open('Kích thước ảnh không được lớn hơn 10 MB', 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
        return;
      }
      const files = event.target.files;
      const selectedFile = files[0];
      control.setValue(selectedFile);
    }
  }

  get localStorage() {
    return localStorage;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    if (!confirm('Hãy chắc chắn mọi thông tin đã chính xác!')) {
      return;
    }
    const formData = new FormData();
    formData.append('langCode', 'vi');
    const answers = this.form.value;
    // this.questionTableIndexs.forEach(indexkey => {
    //   const value = this.form.get(indexkey).value;
    //   if (value) {
    //     answers[indexkey] = value.map(item => Object.values(item).join('#cell#')).join('#ans#');
    //   }
    // });
    this.questionAttachIndexs.forEach(indexkey => {
      const value = this.form.get(indexkey).value;
      if (value) {
        const extention = value.name.split('.').pop();
        formData.append('files', value, indexkey + '.' + extention);
      }
      delete answers[indexkey];
    });
    formData.append('answers', new Blob([JSON.stringify(answers)], {
      type: 'application/json'
    }));
    if (this.customerID) {
      formData.append('customerID', this.customerID.toString());
    }
    if (this.isPublicPhonenumber.value !== null) {
      formData.append('isPublicPhonenumber', this.isPublicPhonenumber.value.toString());
    }
    if (this.price.value !== null) {
      formData.append('price', this.price.value.toString());
    }
    if (this.moneyBackOrigin.value !== null) {
      formData.append('moneyBackOrigin', this.moneyBackOrigin.value.toString());
    }
    if (this.moneyAfterFly.value !== null) {
      formData.append('moneyAfterFly', this.moneyAfterFly.value.toString());
    }
    if (this.createdDate.value !== null) {
      formData.append('createdDate', this.createdDate.value.format('DD/MM/YYYY'));
    }
    if (this.timePass.value !== null) {
      formData.append('timePass', this.timePass.value.format('DD/MM/YYYY'));
    }
    // const password = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    formData.append('password', '123456');
    this.galleryFileUpload.forEach((item, index) => {
      const name = index.toString() + '#-#' + item.type + '.' + item.ext;
      formData.append('gallery', item.file, name);
    });
    if (this.galleryPreview.length) {
      for (let i = 0; i < this.galleryPreview.length; i++) {
        const ga = this.galleryPreview[i];
        ga.index = i;
        if (ga.isOld) {
          ga.url = ga.url.replace(this.localStorage.getItem('ServerUrl'), '');
        } else if (ga.fileType !== 'iframe') {
          ga.url = 'URL';
        }
      }
      formData.append('galleryPreview', new Blob([JSON.stringify(this.galleryPreview)], {
        type: 'application/json;charset=UTF-8',
      }));
    }
    this.publicService.registerCV(formData).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        window.location.reload();
        // localStorage.setItem('CURRENT_USER', res.data);
        // this.userService.loadUserInfo();
        if (this.customerID) {
          this.snackBar.open('Cập nhật thông tin lao động thành công', 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          window.location.reload();
        } else {
          this.snackBar.open('Khai phom thành công, tên đăng nhập là số điện thoại, mật khẩu mặc định là <b>123456</b>', 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
        }
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    });
  }
  changeAnswer(answers, control: FormControl) {
    control.setValue(answers);
  }
  onHold(time) {
  }

  // intervalHold;
  record(event, formControl: CustomFormControl) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isRecording) {
      this.selectedVoiceFormControl = formControl;
      this.isRecording = true;
      this.seconds = 0;
      this.audioRecording.startRecording();
      // this.intervalHold = setInterval(() => {
      //   this.seconds++;
      // }, 1000);
    }
  }
  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecording.abortRecording();
      this.selectedVoiceFormControl = null;
      this.seconds = 0;
    }
  }
  ngOnDestroy(): void {
    this.abortRecording();
  }
  resetForm() {
    this.form.reset();
  }
  changePublicPhone(event) {
    this.isPublicPhonenumber.setValue(event.checked);
  }

  selectIframe() {
    const dialogRef = this.dialog.open(SelectIframeComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.galleryPreview.splice(this.selectedGalleryIndex, 1,
          { url: result.url, fileType: result.fileType, isOld: false });
      }
    });
  }
}
