import { TestBed } from '@angular/core/testing';

import { AVMService } from './avm.service';

describe('AVMService', () => {
  let service: AVMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AVMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
