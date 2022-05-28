import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExteriorTwoComponent } from './exterior-two.component';

describe('ExteriorTwoComponent', () => {
  let component: ExteriorTwoComponent;
  let fixture: ComponentFixture<ExteriorTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExteriorTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExteriorTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
