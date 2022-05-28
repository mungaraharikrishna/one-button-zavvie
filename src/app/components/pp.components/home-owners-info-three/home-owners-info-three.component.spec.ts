import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnersInfoThreeComponent } from './home-owners-info-three.component';

describe('HomeOwnersInfoThreeComponent', () => {
  let component: HomeOwnersInfoThreeComponent;
  let fixture: ComponentFixture<HomeOwnersInfoThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnersInfoThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnersInfoThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
