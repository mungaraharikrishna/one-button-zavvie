import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextBackButtonsComponent } from './next-back-buttons.component';

describe('NextBackButtonsComponent', () => {
  let component: NextBackButtonsComponent;
  let fixture: ComponentFixture<NextBackButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextBackButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextBackButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
