import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { FormControl } from '@angular/forms';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss'],
})
export class CvComponent implements OnInit, AfterViewInit {
  public VOCABULARY_ANSWERS = {};
  public VOCABULARY_USINGS = {};
  public VOCABULARY_COLUMNS = {};
  public ANSWERS_TABLE = {};
  listLang = [];
  scale;
  loadedData = false;
  @ViewChild('cvContainer') cvContainer: ElementRef;
  langCode = new FormControl('vi');
  isShowLogo = true;
  customerID;
  constructor(
    private userService: UserService,
    private publicService: PublicService,
    private router: Router
  ) {
    this.userService.isBlank.next(true);
    this.initData();
    this.userService.currentCustomer.subscribe((cus) => {
      if (cus) {
        this.customerID = cus.id;
      }
    });
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initData();
      }
    });
    this.langCode.valueChanges.subscribe((value) => this.initData());
    this.userService.loadUserInfo();
  }
  initData() {
    this.publicService
      .getDataForCV(this.langCode.value)
      .subscribe((res: ResponseApi) => {
        const data = res.data;
        this.VOCABULARY_ANSWERS = data.VOCABULARY_ANSWERS;
        this.VOCABULARY_USINGS = data.VOCABULARY_USINGS;
        this.VOCABULARY_COLUMNS = data.VOCABULARY_COLUMNS;
        this.ANSWERS_TABLE = data.ANSWERS_TABLE;
        this.loadedData = true;
        this.reScale();
      });
  }

  ngOnInit(): void {
    this.publicService
      .getWebsiteLanguage(false)
      .subscribe((res: ResponseApi) => {
        this.listLang = res.data;
      });
  }
  reScale() {
    const containerWidth = (this.cvContainer.nativeElement as HTMLElement)
      .clientWidth;
    this.scale = containerWidth > 1000 ? 1 : containerWidth / 1000;
  }
  get localStorage() {
    return localStorage;
  }
  ngAfterViewInit() {
    // this.scale = 1;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.reScale();
  }
  getKeys(obj) {
    return obj ? Object.keys(obj) : null;
  }
  downloadPDF() {
    const data = document.getElementById('cv-wrapper');
    html2canvas(data, {
      scale: 3 / this.scale,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 190;
      const pageHeight = 320;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 10, 5, imgWidth, imgHeight);
      pdf.save('CV.pdf');
    });
  }
  print() {
    window.print();
  }
  getTableAnswer(answer: string) {
    const rs = [];
    if (answer) {
      answer.split('#ans#', -1).forEach((item) => {
        if (item) {
          rs.push(item.split('#cell#', -1));
        }
      });
    }
    return rs;
  }
}
