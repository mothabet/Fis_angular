import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWorkDataComponent } from './shared-work-data.component';

describe('SharedWorkDataComponent', () => {
  let component: SharedWorkDataComponent;
  let fixture: ComponentFixture<SharedWorkDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedWorkDataComponent]
    });
    fixture = TestBed.createComponent(SharedWorkDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
