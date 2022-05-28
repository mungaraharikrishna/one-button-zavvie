import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTextSmComponent } from './simple-text-sm.component';

describe('SimpleTextSmComponent', () => {
  let component: SimpleTextSmComponent;
  let fixture: ComponentFixture<SimpleTextSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTextSmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTextSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
