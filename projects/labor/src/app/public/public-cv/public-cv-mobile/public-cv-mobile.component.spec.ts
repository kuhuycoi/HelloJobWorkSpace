import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCvMobileComponent } from './public-cv-mobile.component';

describe('PublicCvMobileComponent', () => {
  let component: PublicCvMobileComponent;
  let fixture: ComponentFixture<PublicCvMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicCvMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCvMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
