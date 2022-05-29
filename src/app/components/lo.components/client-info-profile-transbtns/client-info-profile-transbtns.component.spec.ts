import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInfoProfileTransbtnsComponent } from './client-info-profile-transbtns.component';

describe('ClientInfoProfileTransbtnsComponent', () => {
  let component: ClientInfoProfileTransbtnsComponent;
  let fixture: ComponentFixture<ClientInfoProfileTransbtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInfoProfileTransbtnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfoProfileTransbtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
