import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageWithoutTransRepComponent } from './percentage-without-trans-rep.component';

describe('PercentageWithoutTransRepComponent', () => {
  let component: PercentageWithoutTransRepComponent;
  let fixture: ComponentFixture<PercentageWithoutTransRepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PercentageWithoutTransRepComponent]
    });
    fixture = TestBed.createComponent(PercentageWithoutTransRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
