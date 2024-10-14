import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoYearsWithPartsRepComponent } from './two-years-with-parts-rep.component';

describe('TwoYearsWithPartsRepComponent', () => {
  let component: TwoYearsWithPartsRepComponent;
  let fixture: ComponentFixture<TwoYearsWithPartsRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoYearsWithPartsRepComponent]
    });
    fixture = TestBed.createComponent(TwoYearsWithPartsRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
