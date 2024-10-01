import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterFormCoverComponent } from './quarter-form-cover.component';

describe('QuarterFormCoverComponent', () => {
  let component: QuarterFormCoverComponent;
  let fixture: ComponentFixture<QuarterFormCoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterFormCoverComponent]
    });
    fixture = TestBed.createComponent(QuarterFormCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
