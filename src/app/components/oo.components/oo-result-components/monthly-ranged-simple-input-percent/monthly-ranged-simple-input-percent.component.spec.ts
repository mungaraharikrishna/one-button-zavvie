import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyRangedSimpleInputPercentComponent } from './monthly-ranged-simple-input-percent.component';

describe('MonthlyRangedSimpleInputPercentComponent', () => {
  let component: MonthlyRangedSimpleInputPercentComponent;
  let fixture: ComponentFixture<MonthlyRangedSimpleInputPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyRangedSimpleInputPercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyRangedSimpleInputPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
