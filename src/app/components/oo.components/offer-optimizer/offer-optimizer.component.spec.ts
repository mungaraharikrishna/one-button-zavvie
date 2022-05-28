import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferOptimizerComponent } from './offer-optimizer.component';

describe('OfferOptimizerComponent', () => {
  let component: OfferOptimizerComponent;
  let fixture: ComponentFixture<OfferOptimizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferOptimizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferOptimizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
