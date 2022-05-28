import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerEmailComponent } from './buyer-email.component';

describe('BuyerEmailComponent', () => {
  let component: BuyerEmailComponent;
  let fixture: ComponentFixture<BuyerEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
