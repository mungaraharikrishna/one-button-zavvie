import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercDollarInputsComponent } from './perc-dollar-inputs.component';

describe('PercDollarInputsComponent', () => {
  let component: PercDollarInputsComponent;
  let fixture: ComponentFixture<PercDollarInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercDollarInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercDollarInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
