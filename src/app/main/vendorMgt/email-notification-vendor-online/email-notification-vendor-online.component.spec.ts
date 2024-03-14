import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotificationVendorOnlineComponent } from './email-notification-vendor-online.component';

describe('EmailNotificationVendorOnlineComponent', () => {
  let component: EmailNotificationVendorOnlineComponent;
  let fixture: ComponentFixture<EmailNotificationVendorOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailNotificationVendorOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotificationVendorOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
