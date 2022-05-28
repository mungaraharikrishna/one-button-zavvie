import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeHybridRangedDoublePercentDollarInputsComponent } from './bridge-hybrid-ranged-double-percent-dollar-inputs.component';

describe('BridgeHybridRangedDoublePercentDollarInputsComponent', () => {
  let component: BridgeHybridRangedDoublePercentDollarInputsComponent;
  let fixture: ComponentFixture<BridgeHybridRangedDoublePercentDollarInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeHybridRangedDoublePercentDollarInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeHybridRangedDoublePercentDollarInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
