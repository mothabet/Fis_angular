import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableWithoutTransComponent } from './shared-table-without-trans.component';

describe('SharedTableWithoutTransComponent', () => {
  let component: SharedTableWithoutTransComponent;
  let fixture: ComponentFixture<SharedTableWithoutTransComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTableWithoutTransComponent]
    });
    fixture = TestBed.createComponent(SharedTableWithoutTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
