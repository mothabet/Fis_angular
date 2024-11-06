import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearWithPartsAndTotalRepComponent } from './one-year-with-parts-and-total-rep.component';

describe('OneYearWithPartsAndTotalRepComponent', () => {
  let component: OneYearWithPartsAndTotalRepComponent;
  let fixture: ComponentFixture<OneYearWithPartsAndTotalRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneYearWithPartsAndTotalRepComponent]
    });
    fixture = TestBed.createComponent(OneYearWithPartsAndTotalRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
