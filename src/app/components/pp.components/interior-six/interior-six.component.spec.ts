import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteriorSixComponent } from './interior-six.component';

describe('InteriorSixComponent', () => {
  let component: InteriorSixComponent;
  let fixture: ComponentFixture<InteriorSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteriorSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteriorSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
