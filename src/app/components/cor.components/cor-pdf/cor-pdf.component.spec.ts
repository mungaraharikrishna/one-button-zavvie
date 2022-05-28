import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorPdfComponent } from './cor-pdf.component';

describe('CorPdfComponent', () => {
  let component: CorPdfComponent;
  let fixture: ComponentFixture<CorPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
