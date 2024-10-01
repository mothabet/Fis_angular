import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOneYearWithPartsComponent } from './shared-one-year-with-parts.component';

describe('SharedOneYearWithPartsComponent', () => {
  let component: SharedOneYearWithPartsComponent;
  let fixture: ComponentFixture<SharedOneYearWithPartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedOneYearWithPartsComponent]
    });
    fixture = TestBed.createComponent(SharedOneYearWithPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
