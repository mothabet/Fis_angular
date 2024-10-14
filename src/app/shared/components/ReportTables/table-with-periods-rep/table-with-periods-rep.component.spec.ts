import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithPeriodsRepComponent } from './table-with-periods-rep.component';

describe('TableWithPeriodsRepComponent', () => {
  let component: TableWithPeriodsRepComponent;
  let fixture: ComponentFixture<TableWithPeriodsRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithPeriodsRepComponent]
    });
    fixture = TestBed.createComponent(TableWithPeriodsRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
