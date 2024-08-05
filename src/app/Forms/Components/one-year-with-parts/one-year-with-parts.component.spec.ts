import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearWithPartsComponent } from './one-year-with-parts.component';

describe('OneYearWithPartsComponent', () => {
  let component: OneYearWithPartsComponent;
  let fixture: ComponentFixture<OneYearWithPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneYearWithPartsComponent]
    });
    fixture = TestBed.createComponent(OneYearWithPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
