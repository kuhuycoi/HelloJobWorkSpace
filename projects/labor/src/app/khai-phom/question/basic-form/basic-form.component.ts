import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MicOverlayComponent } from 'projects/tools/src/lib/components/mic-overlay/mic-overlay.component';
import { Router } from '@angular/router';
import { AudioRecording } from 'projects/tools/src/lib/utils/audio-recording';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';
import { VocabularyUsing } from 'projects/tools/src/lib/types/vocabulary-using';
import { CustomFormControl } from 'projects/tools/src/lib/types/custom-form-control';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss'],
})
export class BasicFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hiddenLink', { static: false }) hiddenLink: ElementRef;
  loaded = false;
  vocabularies: VocabularyUsing[] = [];
  provinceQuestionKey = ['44', '9'];
  provinces = [];
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
  selectedIndex = 0;
  customerID;
  registeredCustomer;
  audioRecording = new AudioRecording();
  isPublicPhonenumber = new FormControl(false);
  constructor(
    private publicService: PublicService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.publicService.getListProvince().subscribe((res: ResponseApi) => {
      this.provinces = res.data;
    });
    if (this.userService.currentCustomer.value) {
      this.registeredCustomer = this.userService.currentCustomer.value;
      this.customerID = this.registeredCustomer.id;
      this.isPublicPhonenumber.setValue(
        this.registeredCustomer.isPublicPhonenumber
      );
    }
    this.changeFormStructure();
    this.audioRecording.recordingFailed().subscribe((error) => {
      if (error) {
        this.isRecording = false;
        this.snackBar.open('Thiết bị của bạn không hộ trợ ghi âm', 'x', {
          panelClass: ['style-error'],
          duration: 2500,
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
        this.publicService
          .speechToText(formData)
          .subscribe((res: ResponseApi) => {
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
  ngOnInit() {}

  ngAfterViewInit() {}
  get selectedControl() {
    return this.selectedIndex <= this.formControls.length - 1
      ? this.formControls[this.selectedIndex]
      : null;
  }
  nextStep() {
    if (
      this.selectedControl.invalid ||
      this.selectedIndex === this.formControls.length
    ) {
      return;
    }
    this.selectedIndex++;
  }
  prevStep() {
    this.selectedIndex--;
  }
  getColumns(parentIndexKey) {
    return this.vocabularies.filter(
      (item) => item.parentIndexKey === parentIndexKey
    );
  }
  changeFormStructure() {
    this.publicService
      .findAllCVQuestionsAndAnswers(this.customerID)
      .subscribe((res: ResponseApi) => {
        const data = res.data;
        this.answers = data.ANSWERS;
        this.suggestions = data.SUGGESTIONS;
        this.vocabularies = data.QUESTIONS;
        const tableAns = data.ANSWERS_TABLE;
        this.formControls = [];
        const formControls = {};
        this.vocabularies
          .filter(
            (question) =>
              question.isBasicInfo &&
              question.vocabularyUsingTypeID &&
              !question.parentIndexKey &&
              question.vocabularyUsingTypeID.code !== 'TEXT'
          )
          .forEach((element: VocabularyUsing) => {
            const formControl = new CustomFormControl(null);
            formControl.indexkey = element.indexKey;
            formControl.question = element;
            formControl.required = element.isRequired;
            formControl.placeholder = element.vocabularyID.content;
            formControl.usingType = element.vocabularyUsingTypeID;
            formControl.hint = element.hint;
            const ans = this.answers[element.indexKey]
              ? this.answers[element.indexKey].content
              : null;
            if (
              element.isEditable ||
              typeof ans === 'undefined' ||
              ans == null
            ) {
              element.isEditable = true;
            }
            formControl.isEditable = element.isEditable;
            if (element.isRequired) {
              formControl.setValidators([Validators.required]);
            }
            if (element.answers) {
              formControl.answers = element.answers.split('##');
            }
            const controlKey =
              element.indexKey +
              '##' +
              (element.vocabularyID ? element.vocabularyID.id.toString() : '') +
              '##' +
              element.vocabularyUsingTypeID.code +
              '##' +
              element.isSuggestion;
            if (element.isSuggestion) {
              formControl.suggestions = this.suggestions.filter(
                (suggestion) =>
                  element.vocabularyID &&
                  element.vocabularyID.id === suggestion.vocabularyID
              );
              formControl.filteredSuggestions = formControl.valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(formControl))
              );
            }
            if (
              formControl.usingType &&
              formControl.usingType.code === 'QUESTION_TABLE'
            ) {
              this.questionTableIndexs.push(controlKey);
              formControl.columns = this.vocabularies.filter(
                (item) => item.parentIndexKey === element.indexKey
              );
              const value = [];
              const totalRow = this.answers[element.indexKey]
                ? this.answers[element.indexKey].totalRow
                : 0;
              for (let i = 0; i < totalRow; i++) {
                const currentTableAns = {};
                tableAns
                  .filter(
                    (item) =>
                      item.parentIndexKey === element.indexKey &&
                      item.answerOrder === i
                  )
                  .forEach((item) => {
                    const column = formControl.columns.find(
                      (cur) => cur.indexKey === item.indexKey
                    );
                    const cellControlKey =
                      item.indexKey +
                      '##' +
                      column.vocabularyID.id.toString() +
                      '##' +
                      column.vocabularyUsingTypeID.code +
                      '##' +
                      column.isSuggestion;
                    currentTableAns[cellControlKey] = item.content;
                  });
                value.push(currentTableAns);
              }
              formControl.setValue(value);
            } else if (
              formControl.usingType &&
              formControl.usingType.code === 'QUESTION_ATTACH'
            ) {
              this.questionAttachIndexs.push(controlKey);
            } else if (
              formControl.usingType &&
              formControl.usingType.code === 'QUESTION_DATE' &&
              ans
            ) {
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

  private _filter(formControl: CustomFormControl) {
    const filterValue = formControl.value
      ? formControl.value.toLowerCase()
      : null;
    return formControl.suggestions.filter((item) => {
      return (
        item.content &&
        removeUnicode(item.content.toLowerCase()).includes(
          removeUnicode(filterValue)
        )
      );
    });
  }
  isProvinceQuestion(indexkey) {
    return this.provinceQuestionKey.indexOf(indexkey) > -1;
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
      if (event.target.files[0].size > 10485760) {
        this.snackBar.open('Kích thước ảnh không được lớn hơn 10 MB', 'x', {
          panelClass: ['style-error'],
          duration: 2500,
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
    this.questionAttachIndexs.forEach((indexkey) => {
      const value = this.form.get(indexkey).value;
      if (value) {
        const extention = value.name.split('.').pop();
        formData.append('files', value, indexkey + '.' + extention);
      }
      delete answers[indexkey];
    });
    formData.append(
      'answers',
      new Blob([JSON.stringify(answers)], {
        type: 'application/json',
      })
    );
    if (this.customerID) {
      formData.append('customerID', this.customerID.toString());
    }
    if (this.isPublicPhonenumber.value !== null) {
      formData.append(
        'isPublicPhonenumber',
        this.isPublicPhonenumber.value.toString()
      );
    }
    // const password = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    formData.append('password', '123456');
    this.publicService.registerCV(formData).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
        localStorage.setItem('CURRENT_USER', res.data);
        this.userService.loaded.next(false);
        this.userService.loadUserInfo();
        this.router.navigate(['/khai-phom/thanh-cong'], {
          queryParams: {
            n:
              typeof this.customerID === 'undefined' || this.customerID == null,
          },
        });
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      }
    });
  }
  changeAnswer(answers, control: FormControl) {
    control.setValue(answers);
  }
  onHold(time) {}

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
}
