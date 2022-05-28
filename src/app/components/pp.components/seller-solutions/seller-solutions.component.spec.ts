import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSolutionsComponent } from './seller-solutions.component';

describe('SellerSolutionsComponent', () => {
  let component: SellerSolutionsComponent;
  let fixture: ComponentFixture<SellerSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
