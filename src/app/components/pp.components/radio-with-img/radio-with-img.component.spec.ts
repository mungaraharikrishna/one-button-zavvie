import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioWithImgComponent } from './radio-with-img.component';

describe('RadioWithImgComponent', () => {
  let component: RadioWithImgComponent;
  let fixture: ComponentFixture<RadioWithImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioWithImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioWithImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
