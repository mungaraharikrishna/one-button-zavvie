import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangedPercDollarInputsComponent } from './ranged-perc-dollar-inputs.component';

describe('RangedPercDollarInputsComponent', () => {
  let component: RangedPercDollarInputsComponent;
  let fixture: ComponentFixture<RangedPercDollarInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangedPercDollarInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangedPercDollarInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
