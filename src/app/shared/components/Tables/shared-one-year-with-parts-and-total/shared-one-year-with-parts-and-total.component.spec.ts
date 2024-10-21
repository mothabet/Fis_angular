import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOneYearWithPartsAndTotalComponent } from './shared-one-year-with-parts-and-total.component';

describe('SharedOneYearWithPartsAndTotalComponent', () => {
  let component: SharedOneYearWithPartsAndTotalComponent;
  let fixture: ComponentFixture<SharedOneYearWithPartsAndTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedOneYearWithPartsAndTotalComponent]
    });
    fixture = TestBed.createComponent(SharedOneYearWithPartsAndTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
