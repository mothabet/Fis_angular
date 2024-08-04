import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateTablesTypesComponent } from './navigate-tables-types.component';

describe('NavigateTablesTypesComponent', () => {
  let component: NavigateTablesTypesComponent;
  let fixture: ComponentFixture<NavigateTablesTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigateTablesTypesComponent]
    });
    fixture = TestBed.createComponent(NavigateTablesTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
