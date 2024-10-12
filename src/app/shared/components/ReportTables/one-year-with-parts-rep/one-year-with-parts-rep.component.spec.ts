import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearWithPartsRepComponent } from './one-year-with-parts-rep.component';

describe('OneYearWithPartsRepComponent', () => {
  let component: OneYearWithPartsRepComponent;
  let fixture: ComponentFixture<OneYearWithPartsRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneYearWithPartsRepComponent]
    });
    fixture = TestBed.createComponent(OneYearWithPartsRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
