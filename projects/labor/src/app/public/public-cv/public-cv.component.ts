import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { FormControl } from '@angular/forms';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
declare var $: any;

@Component({
  selector: 'app-public-cv',
  templateUrl: './public-cv.component.html',
  styleUrls: ['./public-cv.component.scss'],
})
export class PublicCvComponent implements OnInit, AfterViewInit {
  public VOCABULARY_ANSWERS = {};
  public VOCABULARY_USINGS = {};
  public VOCABULARY_COLUMNS = {};
  public ANSWERS_TABLE = {};
  public CUSTOMER;
  public PARENT;
  lang = 'vi';
  scale;
  loadedData = false;
  listLang = [];
  @ViewChild('cvContainer') cvContainer: ElementRef;
  langCode = new FormControl('vi');
  customerID;
  isShowLogo = true;
  constructor(
    private userService: UserService,
    private publicService: PublicService,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((data) => {
      this.lang = data.lang;
      this.langCode.setValue(data.lang);
    });
    this.userService.isBlank.next(true);
    this.publicService
      .getWebsiteLanguage(false)
      .subscribe((res: ResponseApi) => {
        this.listLang = res.data;
      });
    route.params.subscribe((params) => {
      this.customerID = params.id;
      this.getData();
    });
    this.langCode.valueChanges.subscribe((value) => this.getData());
  }

  ngOnInit(): void {}
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }

  getPublicPhonenumber(cus) {
    if (cus.isPublicPhonenumber && cus.phonenumber != null) {
      return cus.phonenumber;
    } else if (cus.partnerCompanyID != null && cus.partnerCompanyID.mobile) {
      return cus.partnerCompanyID.mobile;
    } else if (
      !cus.isPublicPhonenumber &&
      cus.phonenumber != null &&
      cus.phonenumber.length > 6
    ) {
      let phonenumber = cus.phonenumber.substring(0, 3);
      for (let i = 0; i < cus.phonenumber.length - 4; i++) {
        phonenumber += 'x';
      }
      return phonenumber;
    }
    return null;
  }
  getData() {
    this.publicService
      .getDataForCV(this.langCode.value, this.customerID)
      .subscribe((res: ResponseApi) => {
        const data = res.data;
        this.VOCABULARY_ANSWERS = data.VOCABULARY_ANSWERS;
        this.VOCABULARY_USINGS = data.VOCABULARY_USINGS;
        this.VOCABULARY_COLUMNS = data.VOCABULARY_COLUMNS;
        this.ANSWERS_TABLE = data.ANSWERS_TABLE;
        this.CUSTOMER = data.CUSTOMER;
        this.PARENT = this.CUSTOMER.partnerCompanyID;
        this.loadedData = true;
        this.publicService.upViewCustomer(this.customerID).subscribe();
        this.reScale();
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
  getKeys(obj) {
    return obj ? Object.keys(obj) : null;
  }
  ngAfterViewInit() {
    // this.scale = 1;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.reScale();
  }
  downloadPDF() {
    // $('#cv-wrapper').removeClass('d-none');
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
      // $('#cv-wrapper').addClass('d-none');
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
