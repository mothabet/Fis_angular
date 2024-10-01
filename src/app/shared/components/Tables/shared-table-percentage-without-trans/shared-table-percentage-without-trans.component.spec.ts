import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTablePercentageWithoutTransComponent } from './shared-table-percentage-without-trans.component';

describe('SharedTablePercentageWithoutTransComponent', () => {
  let component: SharedTablePercentageWithoutTransComponent;
  let fixture: ComponentFixture<SharedTablePercentageWithoutTransComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTablePercentageWithoutTransComponent]
    });
    fixture = TestBed.createComponent(SharedTablePercentageWithoutTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
