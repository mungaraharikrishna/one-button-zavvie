import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownPaymentComponent } from './down-payment.component';

describe('DownPaymentComponent', () => {
  let component: DownPaymentComponent;
  let fixture: ComponentFixture<DownPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
