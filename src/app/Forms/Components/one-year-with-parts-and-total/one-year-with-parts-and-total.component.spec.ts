import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearWithPartsAndTotalComponent } from './one-year-with-parts-and-total.component';

describe('OneYearWithPartsAndTotalComponent', () => {
  let component: OneYearWithPartsAndTotalComponent;
  let fixture: ComponentFixture<OneYearWithPartsAndTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneYearWithPartsAndTotalComponent]
    });
    fixture = TestBed.createComponent(OneYearWithPartsAndTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
