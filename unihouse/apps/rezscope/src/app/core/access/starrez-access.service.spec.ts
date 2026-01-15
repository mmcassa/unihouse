import { TestBed } from '@angular/core/testing';

import { StarrezAccessService } from './starrez-access.service';

describe('StarrezAccessService', () => {
  let service: StarrezAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarrezAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
