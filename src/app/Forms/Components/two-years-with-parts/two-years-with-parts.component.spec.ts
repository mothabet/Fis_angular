import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoYearsWithPartsComponent } from './two-years-with-parts.component';

describe('TwoYearsWithPartsComponent', () => {
  let component: TwoYearsWithPartsComponent;
  let fixture: ComponentFixture<TwoYearsWithPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoYearsWithPartsComponent]
    });
    fixture = TestBed.createComponent(TwoYearsWithPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
