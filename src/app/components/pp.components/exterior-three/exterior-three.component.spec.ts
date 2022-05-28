import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExteriorThreeComponent } from './exterior-three.component';

describe('ExteriorThreeComponent', () => {
  let component: ExteriorThreeComponent;
  let fixture: ComponentFixture<ExteriorThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExteriorThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExteriorThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
