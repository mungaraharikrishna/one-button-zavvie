import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangedDoublePercentDollarInputsComponent } from './ranged-double-percent-dollar-inputs.component';

describe('RangedDoublePercentDollarInputsComponent', () => {
  let component: RangedDoublePercentDollarInputsComponent;
  let fixture: ComponentFixture<RangedDoublePercentDollarInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangedDoublePercentDollarInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangedDoublePercentDollarInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
