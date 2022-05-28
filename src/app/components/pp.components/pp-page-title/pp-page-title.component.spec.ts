import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpPageTitleComponent } from './pp-page-title.component';

describe('PpPageTitleComponent', () => {
  let component: PpPageTitleComponent;
  let fixture: ComponentFixture<PpPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpPageTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PpPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
