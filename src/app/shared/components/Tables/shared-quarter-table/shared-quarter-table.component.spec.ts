import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuarterTableComponent } from './shared-quarter-table.component';

describe('SharedQuarterTableComponent', () => {
  let component: SharedQuarterTableComponent;
  let fixture: ComponentFixture<SharedQuarterTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedQuarterTableComponent]
    });
    fixture = TestBed.createComponent(SharedQuarterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
