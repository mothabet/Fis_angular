import { TestBed } from '@angular/core/testing';

import { AuditRuleHomeService } from './audit-rule-home.service';

describe('AuditRuleHomeService', () => {
  let service: AuditRuleHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditRuleHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
