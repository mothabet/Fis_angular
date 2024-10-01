import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFormCoverComponent } from './shared-form-cover.component';

describe('SharedFormCoverComponent', () => {
  let component: SharedFormCoverComponent;
  let fixture: ComponentFixture<SharedFormCoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedFormCoverComponent]
    });
    fixture = TestBed.createComponent(SharedFormCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
