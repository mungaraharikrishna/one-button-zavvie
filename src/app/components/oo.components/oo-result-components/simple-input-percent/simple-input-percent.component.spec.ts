import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleInputPercentComponent } from './simple-input-percent.component';

describe('SimpleInputPercentComponent', () => {
  let component: SimpleInputPercentComponent;
  let fixture: ComponentFixture<SimpleInputPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleInputPercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleInputPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
