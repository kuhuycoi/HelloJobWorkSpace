import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';

@Component({
  selector: 'app-hj10-hometown',
  templateUrl: './hj10-hometown.component.html',
  styleUrls: ['./hj10-hometown.component.scss']
})
export class Hj10HometownComponent implements OnInit {
  public identifier: string = 'que-quan';
  private selectedProvinceID = null;
  public address = new FormControl('', [
    Validators.required
  ]);

  provinces: any[] = [];
  filteredProvinces: Observable<any[]>;

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private publicService: PublicService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.filteredProvinces = this.address.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.loadData();
  }

  private loadData() {
    this.publicService.findAllProvince().subscribe((res: any) => {
      if (res) {
        this.provinces = res.data;
        this.loadCacheData();
      }
    });
  }

  private loadCacheData() {
    if (this.service.userInfo.provinceID) {
      this.selectedProvinceID = this.provinces.find(item => item.id = this.service.userInfo.provinceID.id);
      this.address.setValue(this.service.userInfo.provinceID.name);
    }
  }

  private _filter(value: any) {
    if (typeof value !== 'string') {
      value = value?.name;
    }
    const filterValue = this._normalizeValue(value);
    if (filterValue === '') {
      return this.provinces;
    }
    return this.provinces.filter(province => {
      const rs = this._normalizeValue(province.name as string).includes(filterValue);
      return rs;
    });
  }

  private _normalizeValue(value: string): string {
    if (!value) return '';
    return removeUnicode(value.toLowerCase().replace(/\s/g, ''), ' ');
  }

  public clearCondition(event: Event) {
    event.preventDefault(); event.stopPropagation();
    this.address.setValue('');
  }

  public dataChanged(item) {
    this.selectedProvinceID = item;
    this.address.setValue(item.name);
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  public validate() {
    return !this.address.errors;
  }

  public normalize(name: string) {
    var words = name.trim().split(' ');
    var ret = '';
    for (var i = 0; i < words.length; i++) {
      if (words[i] === '') continue;
      ret = ret.concat(' ', words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase());
    }
    return ret.trim();
  }

  public moveNext(event: Event) {
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    if (this.selectedProvinceID) {
      this.service.userInfo.provinceID = this.selectedProvinceID
    }
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

}
