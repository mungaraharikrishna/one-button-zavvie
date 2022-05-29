import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInfoProfileComponent } from './client-info-profile.component';

describe('ClientInfoProfileComponent', () => {
  let component: ClientInfoProfileComponent;
  let fixture: ComponentFixture<ClientInfoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInfoProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
