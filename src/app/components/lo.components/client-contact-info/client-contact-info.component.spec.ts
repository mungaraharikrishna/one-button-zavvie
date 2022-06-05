import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientContactInfoComponent } from './client-contact-info.component';

describe('ClientContactInfoComponent', () => {
  let component: ClientContactInfoComponent;
  let fixture: ComponentFixture<ClientContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientContactInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
