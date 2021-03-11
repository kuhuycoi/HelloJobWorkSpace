import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { EvaluatePartnerAddComponent } from './evaluate-partner-add/evaluate-partner-add.component';
import { EvaluatePartnerService } from 'projects/tools/src/lib/services/evaluate-partner';
import { Pager } from 'projects/tools/src/lib/types/pager';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-evaluate-partner',
  templateUrl: './evaluate-partner.component.html',
  styleUrls: ['./evaluate-partner.component.scss']
})
export class EvaluatePartnerComponent implements OnInit {
  returnUrl;
  partner;
  id;
  pager;
  items = [];
  voteAverage = [];
  totalVote = 0;
  average = 0;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private evaluatePartnerService: EvaluatePartnerService, private titleService: Title) {
    titleService.setTitle('Hello Job | Đánh giá nhà môi giới');

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      window.scrollTo(0, 0);
      this.pager = new Pager();
      this.pager.orderColumn = 'createdDate';
      this.pager.asc = false;
      const keyword = params.k;
      if (keyword) {
        this.pager.keyword = keyword;
      }
      const place = params.p;
      if (place) {
        this.pager.place = place;
      }
      const orderColumn = params.o;
      if (orderColumn) {
        this.pager.orderColumn = orderColumn;
      }
      const asc = params.a;
      if (typeof asc !== 'undefined' && asc != null) {
        this.pager.asc = Boolean(JSON.parse(asc));
      }
      const currentPage = params.c;
      if (currentPage) {
        try {
          this.pager.currentPage = parseInt(currentPage, 10);
        } catch {
        }
      }
    });

  }
  get queryParams() {
    const params: Params = {};
    if (this.pager.keyword) {
      params.id = this.id;
    }
    if (this.pager.orderColumn) {
      params.o = this.pager.orderColumn;
    }
    if (typeof this.pager.asc !== 'undefined' && this.pager.asc != null) {
      params.a = this.pager.asc;
    }
    return params;
  }

  paging() {
    const params: { [key: string]: any } = {};
    params.currentPage = this.pager.currentPage;
    params.orderColumn = this.pager.orderColumn;
    params.asc = this.pager.asc;
    params.displayPerPage = this.pager.displayPerPage;
    params.id = this.id;
    if (this.pager.place) {
      params.place = this.pager.place;
    }
    if (this.pager.moduleId) {
      params.moduleId = this.pager.moduleId;
    }
    if (this.pager.salaryFrom) {
      params.salaryFrom = this.pager.salaryFrom;
    }
    if (this.pager.salaryTo) {
      params.salaryTo = this.pager.salaryTo;
    }
    if (this.pager.ageFrom) {
      params.ageFrom = this.pager.ageFrom;
    }
    if (this.pager.ageTo) {
      params.ageTo = this.pager.ageTo;
    }
    if (this.pager.gender) {
      params.gender = this.pager.gender;
    }
    this.evaluatePartnerService.evaluatePartnerSearch(params).subscribe((res: ResponsePaging) => {
      this.items = res.items;
      this.pager.totalPage = res.pager.totalPage;
      this.pager.totalResult = res.pager.totalResult;
    });
  }
  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
  }
  reload() {
    const params = this.queryParams;
    if (this.pager.currentPage !== 1) {
      params.c = this.pager.currentPage;
    }
    params.id = this.id;
    this.router.navigate(['/danh-gia-nha-moi-gioi/' + this.id], { queryParams: params });
  }
  get localStorage() {
    return localStorage;
  }
  ngOnInit(): void {
    this.evaluatePartnerService.getStatisticalVotee(this.id).subscribe((res: ResponseApi) => {
      this.voteAverage = res.data;
      let total = 0;
      if (this.voteAverage.length) {
        this.voteAverage.forEach(element => {
          this.totalVote += element.total;
          total += (element.total * element.vote);
        });
        this.average = Math.round((total / this.totalVote) * 10) / 10;
      }
    });
    this.evaluatePartnerService.getPartnerInfo(this.id).subscribe((res: ResponseApi) => {
      this.partner = res.data;
      this.paging();
    });
  }
  public onSubmit() {
  }

  calculatorAverage(vote) {
    let result = 0;
    if (this.voteAverage.length) {
      this.voteAverage.forEach(element => {
        if (element.vote === vote) {
          result += element.total;
        }
      });
      return Math.round(result * 100 / this.totalVote);
    }
    return result;
  }

  addEvaluate() {
    const dialogRef = this.dialog.open(EvaluatePartnerAddComponent, {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      data: { id: this.id }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.pager.currentPage = 1;
        this.reload();
      }
    });
  }
}
