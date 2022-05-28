import { TestBed } from '@angular/core/testing';

import { BuyerMarketService } from './buyer-market.service';

describe('BuyerMarketService', () => {
  let service: BuyerMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyerMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
