import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMaximizeDetailsComponent } from './data-maximize-details.component';

describe('DataMaximizeDetailsComponent', () => {
  let component: DataMaximizeDetailsComponent;
  let fixture: ComponentFixture<DataMaximizeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataMaximizeDetailsComponent]
    });
    fixture = TestBed.createComponent(DataMaximizeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
