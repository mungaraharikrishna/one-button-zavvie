import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorSevenComponent } from './interior-seven.component';

describe('InteriorSevenComponent', () => {
  let component: InteriorSevenComponent;
  let fixture: ComponentFixture<InteriorSevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorSevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
