import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorThreeComponent } from './interior-three.component';

describe('InteriorThreeComponent', () => {
  let component: InteriorThreeComponent;
  let fixture: ComponentFixture<InteriorThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
