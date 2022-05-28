import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberIncrementComponent } from './number-increment.component';

describe('NumberIncrementComponent', () => {
  let component: NumberIncrementComponent;
  let fixture: ComponentFixture<NumberIncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberIncrementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
