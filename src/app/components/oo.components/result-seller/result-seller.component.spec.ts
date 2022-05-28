import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSellerComponent } from './result-seller.component';

describe('ResultComponent', () => {
  let component: ResultSellerComponent;
  let fixture: ComponentFixture<ResultSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultSellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
