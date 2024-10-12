import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithoutTransRepComponent } from './table-without-trans-rep.component';

describe('TableWithoutTransRepComponent', () => {
  let component: TableWithoutTransRepComponent;
  let fixture: ComponentFixture<TableWithoutTransRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithoutTransRepComponent]
    });
    fixture = TestBed.createComponent(TableWithoutTransRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
