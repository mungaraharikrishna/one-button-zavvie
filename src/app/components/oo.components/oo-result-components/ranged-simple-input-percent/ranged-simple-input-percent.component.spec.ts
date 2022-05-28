import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangedSimpleInputPercentComponent } from './ranged-simple-input-percent.component';

describe('RangedSimpleInputPercentComponent', () => {
  let component: RangedSimpleInputPercentComponent;
  let fixture: ComponentFixture<RangedSimpleInputPercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangedSimpleInputPercentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangedSimpleInputPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
