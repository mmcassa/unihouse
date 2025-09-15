import { TestBed } from '@angular/core/testing';

import { StarrezManagementService } from './starrez-management.service';

describe('StarrezManagementService', () => {
  let service: StarrezManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarrezManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
