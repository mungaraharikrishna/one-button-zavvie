import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltInputPercentComponent } from './alt-input-percent.component';

describe('AltInputPercentComponent', () => {
  let component: AltInputPercentComponent;
  let fixture: ComponentFixture<AltInputPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltInputPercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltInputPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
