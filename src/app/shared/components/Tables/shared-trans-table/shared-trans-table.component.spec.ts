import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTransTableComponent } from './shared-trans-table.component';

describe('SharedTransTableComponent', () => {
  let component: SharedTransTableComponent;
  let fixture: ComponentFixture<SharedTransTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTransTableComponent]
    });
    fixture = TestBed.createComponent(SharedTransTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
