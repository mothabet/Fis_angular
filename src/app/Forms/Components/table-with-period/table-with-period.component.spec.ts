import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithPeriodComponent } from './table-with-period.component';

describe('TableWithPeriodComponent', () => {
  let component: TableWithPeriodComponent;
  let fixture: ComponentFixture<TableWithPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithPeriodComponent]
    });
    fixture = TestBed.createComponent(TableWithPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
