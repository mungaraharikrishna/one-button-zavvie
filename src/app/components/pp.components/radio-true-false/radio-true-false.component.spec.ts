import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioTrueFalseComponent } from './radio-true-false.component';

describe('RadioTrueFalseComponent', () => {
  let component: RadioTrueFalseComponent;
  let fixture: ComponentFixture<RadioTrueFalseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioTrueFalseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
