import { TestBed } from '@angular/core/testing';

import { MsalProviderService } from './msal.service';

describe('MsalService', () => {
  let service: MsalProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsalProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
