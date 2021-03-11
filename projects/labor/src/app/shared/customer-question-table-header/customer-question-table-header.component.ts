import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MicOverlayComponent } from 'projects/tools/src/lib/components/mic-overlay/mic-overlay.component';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { AudioRecording } from 'projects/tools/src/lib/utils/audio-recording';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';
import { VocabularyUsing } from 'projects/tools/src/lib/types/vocabulary-using';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { CustomFormControl } from 'projects/tools/src/lib/types/custom-form-control';

@Component({
  selector: 'app-customer-question-table-header',
  templateUrl: './customer-question-table-header.component.html',
  styleUrls: ['./customer-question-table-header.component.scss'],
})
export class CustomerQuestionTableHeaderComponent implements OnInit, OnDestroy {
  questionProvinceKey = 51;
  private _dataSource = [];
  @Input() question;
  @Input() readonly = false;
  @Input() suggestions = [];
  @Output() changeAnswer = new EventEmitter<any>();
  @Input() columns: VocabularyUsing[] = [];
  @Input() provinces = [];
  isRecording = false;
  recordedTime;
  seconds;
  audioRecording = new AudioRecording();
  displayedColumns = [];
  editIndex = null;
  form: FormGroup = new FormGroup({});
  formControls = [];
  selectedVoiceFormControl;
  @Input() set dataSource(dataSource) {
    this._dataSource = dataSource ? Object.assign([], dataSource) : [];
  }
  get dataSource() {
    return this._dataSource;
  }

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private publicService: PublicService
  ) {
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

  ngOnInit() {
    const formControls = {};
    this.formControls = [];
    this.columns.forEach((element, index) => {
      const formControl = new CustomFormControl();
      formControl.id = element.id;
      formControl.indexkey = element.indexKey;
      formControl.placeholder = element.vocabularyID.content;
      formControl.usingType = element.vocabularyUsingTypeID;
      formControl.hint = element.hint;
      formControl.isEditable = element.isEditable;
      this.displayedColumns.push(element.vocabularyID.content);
      const controlKey =
        element.indexKey +
        '##' +
        (element.vocabularyID ? element.vocabularyID.id.toString() : '') +
        '##' +
        element.vocabularyUsingTypeID.code +
        '##' +
        element.isSuggestion;
      if (element.isRequired) {
        formControl.setValidators([Validators.required]);
      }
      if (element.answers) {
        formControl.answers = element.answers.split('##');
      }
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
      formControls[controlKey] = formControl;
      this.formControls.push(formControl);
    });
    this.form = new FormGroup(formControls);
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
  create() {
    const formValue = this.form.value;
    this.form.reset();
    const check = Object.values(formValue).find(
      (item) =>
        typeof item !== 'undefined' &&
        item !== null &&
        item.toString().trim().length > 0
    );
    if (!check) {
      return;
    }
    if (this.editIndex === null) {
      this.dataSource.push(formValue);
    } else {
      this.dataSource.splice(this.editIndex, 1, formValue);
    }
    this.dataSource = [...this.dataSource];
    this.changeAnswer.emit(Object.assign([], this.dataSource));
    this.editIndex = null;
  }
  findFirstData(item) {
    const notEmpty = [];
    Object.keys(item).forEach((key) => {
      if (item[key] && item[key].toString().trim().length) {
        notEmpty.push(item[key].toString().trim());
      }
    });
    return notEmpty.length ? notEmpty.join(', ') + ',...' : '';
  }
  edit(index, elm) {
    this.editIndex = index;
    Object.keys(this.form.controls).forEach((key) => {
      const formControl = this.form.controls[key];
      formControl.setValue(elm[key]);
    });
  }
  delete(elm) {
    const elmIndex = this.dataSource.indexOf(elm);
    if (elmIndex < this.editIndex) {
      this.editIndex--;
    }
    if (elmIndex >= 0) {
      this.dataSource.splice(elmIndex, 1);
      this.dataSource = [...this.dataSource];
      this.changeAnswer.emit(Object.assign([], this.dataSource));
    }
  }

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
}
