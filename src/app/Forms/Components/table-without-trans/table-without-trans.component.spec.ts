import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithoutTransComponent } from './table-without-trans.component';

describe('TableWithoutTransComponent', () => {
  let component: TableWithoutTransComponent;
  let fixture: ComponentFixture<TableWithoutTransComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWithoutTransComponent]
    });
    fixture = TestBed.createComponent(TableWithoutTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
