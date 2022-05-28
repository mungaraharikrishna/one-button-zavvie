import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorFiveComponent } from './interior-five.component';

describe('InteriorFiveComponent', () => {
  let component: InteriorFiveComponent;
  let fixture: ComponentFixture<InteriorFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
