import { TestBed } from '@angular/core/testing';

import { SettingsAuthService } from './settings-auth.service';

describe('SettingsAuthService', () => {
  let service: SettingsAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
