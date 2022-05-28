import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextbackbtnComponent } from './nextbackbtn.component';

describe('NextbackbtnComponent', () => {
  let component: NextbackbtnComponent;
  let fixture: ComponentFixture<NextbackbtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextbackbtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextbackbtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
