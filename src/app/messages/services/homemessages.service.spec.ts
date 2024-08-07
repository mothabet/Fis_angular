import { TestBed } from '@angular/core/testing';

import { HomemessagesService } from './homemessages.service';

describe('HomemessagesService', () => {
  let service: HomemessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomemessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
