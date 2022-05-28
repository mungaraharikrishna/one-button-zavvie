import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBuyerComponent } from './result-buyer.component';

describe('ResultBuyerComponent', () => {
  let component: ResultBuyerComponent;
  let fixture: ComponentFixture<ResultBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
