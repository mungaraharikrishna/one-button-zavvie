import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnersInfoTwoComponent } from './home-owners-info-two.component';

describe('HomeOwnersInfoTwoComponent', () => {
  let component: HomeOwnersInfoTwoComponent;
  let fixture: ComponentFixture<HomeOwnersInfoTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnersInfoTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnersInfoTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
