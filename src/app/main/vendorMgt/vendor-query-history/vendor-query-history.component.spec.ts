import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQueryHistoryComponent } from './vendor-query-history.component';

describe('VendorQueryHistoryComponent', () => {
  let component: VendorQueryHistoryComponent;
  let fixture: ComponentFixture<VendorQueryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorQueryHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQueryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
