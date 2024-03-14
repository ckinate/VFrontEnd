import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingDataComponent } from './on-boarding-data.component';

describe('OnBoardingDataComponent', () => {
  let component: OnBoardingDataComponent;
  let fixture: ComponentFixture<OnBoardingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
