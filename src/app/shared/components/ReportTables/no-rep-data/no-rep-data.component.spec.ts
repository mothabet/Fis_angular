import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRepDataComponent } from './no-rep-data.component';

describe('NoRepDataComponent', () => {
  let component: NoRepDataComponent;
  let fixture: ComponentFixture<NoRepDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoRepDataComponent]
    });
    fixture = TestBed.createComponent(NoRepDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
