import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetVendorStatsComponent } from './widget-vendor-stats.component';

describe('WidgetVendorStatsComponent', () => {
  let component: WidgetVendorStatsComponent;
  let fixture: ComponentFixture<WidgetVendorStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetVendorStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetVendorStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
