import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchYearComponent } from './launch-year.component';

describe('LaunchYearComponent', () => {
  let component: LaunchYearComponent;
  let fixture: ComponentFixture<LaunchYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchYearComponent]
    });
    fixture = TestBed.createComponent(LaunchYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
