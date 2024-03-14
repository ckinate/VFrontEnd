import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingVendorQueryComponent } from './onboarding-vendor-query.component';

describe('OnboardingVendorQueryComponent', () => {
  let component: OnboardingVendorQueryComponent;
  let fixture: ComponentFixture<OnboardingVendorQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingVendorQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingVendorQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
