import { TestBed } from '@angular/core/testing';

import { StarrezTabTracker } from './starrez-tab-tracker';

describe('StarrezTabTracker', () => {
  let service: StarrezTabTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarrezTabTracker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
