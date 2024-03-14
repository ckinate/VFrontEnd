import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvitationComponent } from './vendor-invitation.component';

describe('VendorInvitationComponent', () => {
  let component: VendorInvitationComponent;
  let fixture: ComponentFixture<VendorInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
