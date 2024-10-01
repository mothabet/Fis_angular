import { TestBed } from '@angular/core/testing';

import { HomeCompanyMessagesService } from './home-company-messages.service';

describe('HomeCompanyMessagesService', () => {
  let service: HomeCompanyMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeCompanyMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
