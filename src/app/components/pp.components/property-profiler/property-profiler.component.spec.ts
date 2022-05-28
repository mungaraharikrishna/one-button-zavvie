import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyProfilerComponent } from './property-profiler.component';

describe('PropertyProfilerComponent', () => {
  let component: PropertyProfilerComponent;
  let fixture: ComponentFixture<PropertyProfilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyProfilerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyProfilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
