import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSolutionsComponent } from './buyer-solutions.component';

describe('BuyerSolutionsComponent', () => {
  let component: BuyerSolutionsComponent;
  let fixture: ComponentFixture<BuyerSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
