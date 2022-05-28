import { TestBed } from '@angular/core/testing';

import { PlatformDataService } from './platform-data.service';

describe('PlatformDataService', () => {
  let service: PlatformDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
