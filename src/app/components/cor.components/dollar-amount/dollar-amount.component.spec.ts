import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DollarAmountComponent } from './dollar-amount.component';

describe('DollarAmountComponent', () => {
  let component: DollarAmountComponent;
  let fixture: ComponentFixture<DollarAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DollarAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DollarAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
