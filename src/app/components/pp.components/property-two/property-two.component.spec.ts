import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTwoComponent } from './property-two.component';

describe('PropertyTwoComponent', () => {
  let component: PropertyTwoComponent;
  let fixture: ComponentFixture<PropertyTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
