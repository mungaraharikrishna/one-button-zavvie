import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenMarketComponent } from './open-market.component';

describe('OpenMarketComponent', () => {
  let component: OpenMarketComponent;
  let fixture: ComponentFixture<OpenMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
