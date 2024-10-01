import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuarterFormCoverComponent } from './shared-quarter-form-cover.component';

describe('SharedQuarterFormCoverComponent', () => {
  let component: SharedQuarterFormCoverComponent;
  let fixture: ComponentFixture<SharedQuarterFormCoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedQuarterFormCoverComponent]
    });
    fixture = TestBed.createComponent(SharedQuarterFormCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
