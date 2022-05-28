import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEmailComponent } from './seller-email.component';

describe('SellerEmailComponent', () => {
  let component: SellerEmailComponent;
  let fixture: ComponentFixture<SellerEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
