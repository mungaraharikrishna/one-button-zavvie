import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorTwoComponent } from './interior-two.component';

describe('InteriorTwoComponent', () => {
  let component: InteriorTwoComponent;
  let fixture: ComponentFixture<InteriorTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
