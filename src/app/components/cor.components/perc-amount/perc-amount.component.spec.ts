import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercAmountComponent } from './perc-amount.component';

describe('PercAmountComponent', () => {
  let component: PercAmountComponent;
  let fixture: ComponentFixture<PercAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
