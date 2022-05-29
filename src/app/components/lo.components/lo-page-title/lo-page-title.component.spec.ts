import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoPageTitleComponent } from './lo-page-title.component';

describe('LoPageTitleComponent', () => {
  let component: LoPageTitleComponent;
  let fixture: ComponentFixture<LoPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoPageTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoPageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
