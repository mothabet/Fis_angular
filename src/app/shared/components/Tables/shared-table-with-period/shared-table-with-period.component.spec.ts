import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableWithPeriodComponent } from './shared-table-with-period.component';

describe('SharedTableWithPeriodComponent', () => {
  let component: SharedTableWithPeriodComponent;
  let fixture: ComponentFixture<SharedTableWithPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTableWithPeriodComponent]
    });
    fixture = TestBed.createComponent(SharedTableWithPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
