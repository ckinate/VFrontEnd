import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDiligenceModalComponent } from './due-diligence-modal.component';

describe('DueDiligenceModalComponent', () => {
  let component: DueDiligenceModalComponent;
  let fixture: ComponentFixture<DueDiligenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DueDiligenceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DueDiligenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
