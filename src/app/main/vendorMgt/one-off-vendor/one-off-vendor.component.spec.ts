import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOffVendorComponent } from './one-off-vendor.component';

describe('OneOffVendorComponent', () => {
  let component: OneOffVendorComponent;
  let fixture: ComponentFixture<OneOffVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneOffVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOffVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
