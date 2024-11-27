import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMaximizeComponent } from './data-maximize.component';

describe('DataMaximizeComponent', () => {
  let component: DataMaximizeComponent;
  let fixture: ComponentFixture<DataMaximizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataMaximizeComponent]
    });
    fixture = TestBed.createComponent(DataMaximizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
