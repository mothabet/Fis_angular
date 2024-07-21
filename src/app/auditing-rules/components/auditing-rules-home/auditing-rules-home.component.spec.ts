import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditingRulesHomeComponent } from './auditing-rules-home.component';

describe('AuditingRulesHomeComponent', () => {
  let component: AuditingRulesHomeComponent;
  let fixture: ComponentFixture<AuditingRulesHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditingRulesHomeComponent]
    });
    fixture = TestBed.createComponent(AuditingRulesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
