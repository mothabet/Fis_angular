import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePercentageWithoutTransComponent } from './table-percentage-without-trans.component';

describe('TablePercentageWithoutTransComponent', () => {
  let component: TablePercentageWithoutTransComponent;
  let fixture: ComponentFixture<TablePercentageWithoutTransComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePercentageWithoutTransComponent]
    });
    fixture = TestBed.createComponent(TablePercentageWithoutTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
