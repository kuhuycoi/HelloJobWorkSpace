import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
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
  selector: 'app-step-by-step-form',
  templateUrl: './step-by-step-form.component.html',
  styleUrls: ['./step-by-step-form.component.scss'],
})
export class StepByStepFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('hiddenLink', { static: false }) hiddenLink: ElementRef;
  loaded = false;
  vocabularies: VocabularyUsing[] = [];
  suggestions: {
    id?: string;
    vocabularyID?: number;
    parentID?: string;
    content?: string;
  }[];
  answers: { [key: string]: string } = {};
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
  audioRecording = new AudioRecording();
  constructor(
    private publicService: PublicService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (localStorage.getItem('CURRENT_USER')) {
      this.userService.customerInfo().subscribe((res: ResponseApi) => {
        if (res.data) {
          this.registeredCustomer = res.data;
          this.customerID = this.registeredCustomer.id;
          this.changeFormStructure();
        }
      });
    } else {
      this.changeFormStructure();
    }
    this.audioRecording.recordingFailed().subscribe((error) => {
      this.isRecording = false;
      this.snackBar.open('Thiết bị của bạn không hộ trợ ghi âm', 'x', {
        panelClass: ['style-error'],
        duration: 2500,
      });
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
  changeFormStructure() {
    this.publicService
      .findAllCVQuestionsAndAnswers(this.customerID)
      .subscribe((res: ResponseApi) => {
        const data = res.data;
        this.answers = data.ANSWERS;
        this.suggestions = data.SUGGESTIONS;
        this.vocabularies = (data.QUESTIONS as VocabularyUsing[]).filter(
          (question) =>
            question.isBasicInfo &&
            question.vocabularyUsingTypeID &&
            question.vocabularyUsingTypeID.code !== 'TEXT'
        );
        this.formControls = [];
        const formControls = {};
        this.vocabularies.forEach((element: VocabularyUsing) => {
          const formControl = new CustomFormControl(null);
          formControl.question = element;
          formControl.required = element.isRequired;
          formControl.placeholder = element.vocabularyID.content;
          formControl.usingType = element.vocabularyUsingTypeID;
          formControl.hint = element.hint;
          if (
            element.isEditable ||
            typeof this.answers[element.indexKey] === 'undefined' ||
            this.answers[element.indexKey] == null
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
            if (this.answers && this.answers[element.indexKey]) {
              formControl.setValue(
                this.answers[element.indexKey].split('#ans#').map((answer) => {
                  if (answer) {
                    const obj = {};
                    answer.split('#cell#', -1).forEach((item, index) => {
                      obj[formControl.answers[index]] = item;
                    });
                    return obj;
                  } else {
                    return null;
                  }
                })
              );
            } else if (
              this.answers &&
              !this.answers[element.indexKey] &&
              element.defaultRow
            ) {
              formControl.setValue(
                element.defaultRow.split('#ans#').map((answer) => {
                  if (answer) {
                    const obj = {};
                    answer.split('#cell#', -1).forEach((item, index) => {
                      obj[formControl.answers[index]] = item;
                    });
                    return obj;
                  } else {
                    return null;
                  }
                })
              );
            }
          } else if (
            formControl.usingType &&
            formControl.usingType.code === 'QUESTION_ATTACH'
          ) {
            this.questionAttachIndexs.push(controlKey);
          } else if (
            formControl.usingType &&
            formControl.usingType.code === 'QUESTION_DATE' &&
            this.answers[element.indexKey]
          ) {
            const date = moment(
              this.answers[element.indexKey],
              'DD/MM/YYYY'
            ).toDate();
            formControl.setValue(date);
          } else {
            formControl.setValue(this.answers[element.indexKey]);
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
    this.questionTableIndexs.forEach((indexkey) => {
      const value = this.form.get(indexkey).value;
      if (value) {
        answers[indexkey] = value
          .map((item) => Object.values(item).join('#cell#'))
          .join('#ans#');
      }
    });
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

  // onStart(formControl: CustomFormControl) {
  //   if (!this.isRecording) {
  //     this.selectedVoiceFormControl = formControl;
  //     this.isRecording = true;
  //     this.seconds = 0;
  //     this.audioRecordingService.startRecording();
  //   }
  // }
  // onStop(formControl: CustomFormControl) {
  //   if (this.isRecording) {
  //     this.isRecording = false;
  //     setTimeout(() => {
  //       this.audioRecordingService.stopRecording();
  //     }, 500);
  //   }
  // }
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
  goLastStep(event) {
    this.selectedIndex = this.formControls.length;
  }
  goToStep(event, index) {
    if (event) {
      event.preventDefault();
    }
    this.selectedIndex = index;
  }
  resetStep(event) {
    this.customerID = null;
    this.goToStep(event, 0);
    this.form.reset();
  }
}
