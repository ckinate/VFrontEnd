import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorUpdateRequestsComponent } from './vendor-update-requests.component';

describe('VendorUpdateRequestsComponent', () => {
  let component: VendorUpdateRequestsComponent;
  let fixture: ComponentFixture<VendorUpdateRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorUpdateRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorUpdateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
