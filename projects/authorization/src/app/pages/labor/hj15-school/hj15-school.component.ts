import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

@Component({
  selector: 'app-hj15-school',
  templateUrl: './hj15-school.component.html',
  styleUrls: ['./hj15-school.component.scss'],
})
export class Hj15SchoolComponent implements OnInit {
  public identifier: string = 'bang-cap';
  private selectedHighSchoolID = null;
  characters: any[] = [];
  highSchool = new FormControl(null, [Validators.required]);

  highSchools: any[] = [];
  selectedName;
  filteredHighSchools: Observable<any[]>;
  loaded = false;

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private publicService: PublicService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.filteredHighSchools = this.highSchool.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.loadCacheData();
    this.loadData(this.highSchool.value);
    this.highSchool.valueChanges.subscribe((value) => {
      if (value && value.length > 5) {
        this.loadData(value);
      }
    });
  }

  private loadData(keyword) {
    this.publicService
      .searchHighSchool(keyword)
      .subscribe((res: any) => {
        if (res) {
          this.highSchools = res.data;
        }
      });
  }

  private loadCacheData() {
    if (this.service.userInfo.highSchoolID) {
      this.selectedHighSchoolID = this.service.userInfo.highSchoolID;
      this.selectedName = this.service.userInfo.highSchoolID.name;
      console.log(this.selectedName);
      this.highSchool.setValue(
        this.service.userInfo.highSchoolID.name
      );
    }
    this.loaded = true;
  }

  private _filter(value: any) {
    if (typeof value !== 'string') {
      value = value?.name;
    }
    const filterValue = this._normalizeValue(value);
    if (filterValue === '') {
      return this.highSchools;
    }
    return this.highSchools.filter((highSchool) => {
      const rs = this._normalizeValue(highSchool.name as string).includes(
        filterValue
      );
      return rs;
    });
  }

  private _normalizeValue(value: string): string {
    if (!value) return '';
    return removeUnicode(value.toLowerCase().replace(/\s/g, ''), ' ');
  }

  public clearCondition(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.highSchool.setValue('');
  }

  public onKeyUp(event: any) {
    this.selectedHighSchoolID = null;
  }

  public dataChanged(item) {
    this.selectedHighSchoolID = item;
    this.highSchool.setValue(item?.name);
  }

  public get processPercent() {
    return this.service.getProcessPercent();
  }

  public validate() {
    return !this.highSchool.errors;
  }

  public normalize(name: string) {
    var words = name.trim().split(' ');
    var ret = '';
    for (var i = 0; i < words.length; i++) {
      if (words[i] === '') continue;
      ret = ret.concat(
        ' ',
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase()
      );
    }
    return ret.trim();
  }

  public moveNext(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    if (this.selectedHighSchoolID) {
      this.service.userInfo.highSchoolID = this.selectedHighSchoolID;
    }
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }
}
