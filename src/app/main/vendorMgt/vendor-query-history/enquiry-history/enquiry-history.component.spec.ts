import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryHistoryComponent } from './enquiry-history.component';

describe('EnquiryHistoryComponent', () => {
  let component: EnquiryHistoryComponent;
  let fixture: ComponentFixture<EnquiryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiryHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
