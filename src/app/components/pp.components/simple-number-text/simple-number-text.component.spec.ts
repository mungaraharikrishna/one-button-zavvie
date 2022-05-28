import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleNumberTextComponent } from './simple-number-text.component';

describe('SimpleNumberTextComponent', () => {
  let component: SimpleNumberTextComponent;
  let fixture: ComponentFixture<SimpleNumberTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleNumberTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleNumberTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
