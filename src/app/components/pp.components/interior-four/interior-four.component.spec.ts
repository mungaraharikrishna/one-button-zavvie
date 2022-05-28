import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorFourComponent } from './interior-four.component';

describe('InteriorFourComponent', () => {
  let component: InteriorFourComponent;
  let fixture: ComponentFixture<InteriorFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
