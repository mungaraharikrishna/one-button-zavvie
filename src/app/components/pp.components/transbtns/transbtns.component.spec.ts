import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransbtnsComponent } from './transbtns.component';

describe('TransbtnsComponent', () => {
  let component: TransbtnsComponent;
  let fixture: ComponentFixture<TransbtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransbtnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransbtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
