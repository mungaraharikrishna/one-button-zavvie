import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFourComponent } from './property-four.component';

describe('PropertyFourComponent', () => {
  let component: PropertyFourComponent;
  let fixture: ComponentFixture<PropertyFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
