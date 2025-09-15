import { TestBed } from '@angular/core/testing';

import { ExtEnvironmentService } from './ext-environment.service';

describe('ExtEnvironmentService', () => {
  let service: ExtEnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtEnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
