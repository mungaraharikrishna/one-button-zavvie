import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangedAltInputPercentComponent } from './ranged-alt-input-percent.component';

describe('RangedAltInputPercentComponent', () => {
  let component: RangedAltInputPercentComponent;
  let fixture: ComponentFixture<RangedAltInputPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangedAltInputPercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangedAltInputPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
