import { TestBed } from '@angular/core/testing';

import { ScheduledChangesService } from './scheduled-changes.service';

describe('ScheduledChangesService', () => {
  let service: ScheduledChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduledChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
