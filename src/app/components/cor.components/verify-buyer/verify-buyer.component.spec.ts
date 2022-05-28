import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBuyerComponent } from './verify-buyer.component';

describe('VerifyBuyerComponent', () => {
  let component: VerifyBuyerComponent;
  let fixture: ComponentFixture<VerifyBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
