import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithTransRepComponent } from './table-with-trans-rep.component';

describe('TableWithTransRepComponent', () => {
  let component: TableWithTransRepComponent;
  let fixture: ComponentFixture<TableWithTransRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithTransRepComponent]
    });
    fixture = TestBed.createComponent(TableWithTransRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
