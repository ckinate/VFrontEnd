import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnapprovedVendorComponent } from './edit-unapproved-vendor.component';

describe('EditUnapprovedVendorComponent', () => {
  let component: EditUnapprovedVendorComponent;
  let fixture: ComponentFixture<EditUnapprovedVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUnapprovedVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnapprovedVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
