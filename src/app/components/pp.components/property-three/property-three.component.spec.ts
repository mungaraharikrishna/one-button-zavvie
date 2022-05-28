import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyThreeComponent } from './property-three.component';

describe('PropertyThreeComponent', () => {
  let component: PropertyThreeComponent;
  let fixture: ComponentFixture<PropertyThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
