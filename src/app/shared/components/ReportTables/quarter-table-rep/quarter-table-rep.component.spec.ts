import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterTableRepComponent } from './quarter-table-rep.component';

describe('QuarterTableRepComponent', () => {
  let component: QuarterTableRepComponent;
  let fixture: ComponentFixture<QuarterTableRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterTableRepComponent]
    });
    fixture = TestBed.createComponent(QuarterTableRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
