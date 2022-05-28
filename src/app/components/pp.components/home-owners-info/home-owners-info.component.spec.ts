import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnersInfoComponent } from './home-owners-info.component';

describe('HomeOwnersInfoComponent', () => {
  let component: HomeOwnersInfoComponent;
  let fixture: ComponentFixture<HomeOwnersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnersInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
