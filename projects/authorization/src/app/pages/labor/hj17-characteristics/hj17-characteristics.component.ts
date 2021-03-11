import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-hj17-characteristics',
  templateUrl: './hj17-characteristics.component.html',
  styleUrls: ['./hj17-characteristics.component.scss']
})
export class Hj17CharacteristicsComponent implements OnInit {
  public identifier: string = 'tinh-cach';
  public characters = [];
  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private publicService: PublicService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.publicService.findAllCharacter().subscribe((res: ResponseApi) => {
      this.characters = res.data;
    });
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  public get selectedCharacters(): any[] {
    return this.service.userInfo.character;
  }

  public choose(item) {
    const index = this.selectedCharacters?.findIndex(char => char.id === item.id);
    if (index > -1) {
      this.selectedCharacters.splice(index, 1);
    } else {
      this.selectedCharacters.push(item);
    }
  }
  public validate() {
    return this.selectedCharacters?.length;
  }

  public moveNext(event: Event) {
    event.preventDefault(); event.stopPropagation();
    if (this.validate()) {
      this.service.nextStep(this.router);
    }
  }

  public goBack() {
    this.service.goBack(this.router);
  }
  public isChecked(id: number) {
    return this.selectedCharacters?.findIndex(item => item.id === id) > -1;
  }
}
