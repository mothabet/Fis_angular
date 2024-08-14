import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTwoYearsWithPartsComponent } from './shared-two-years-with-parts.component';

describe('SharedTwoYearsWithPartsComponent', () => {
  let component: SharedTwoYearsWithPartsComponent;
  let fixture: ComponentFixture<SharedTwoYearsWithPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTwoYearsWithPartsComponent]
    });
    fixture = TestBed.createComponent(SharedTwoYearsWithPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
