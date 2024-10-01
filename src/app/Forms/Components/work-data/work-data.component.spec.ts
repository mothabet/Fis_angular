import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDataComponent } from './work-data.component';

describe('WorkDataComponent', () => {
  let component: WorkDataComponent;
  let fixture: ComponentFixture<WorkDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkDataComponent]
    });
    fixture = TestBed.createComponent(WorkDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
