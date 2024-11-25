import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePercentageComponent } from './change-percentage.component';

describe('ChangePercentageComponent', () => {
  let component: ChangePercentageComponent;
  let fixture: ComponentFixture<ChangePercentageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePercentageComponent]
    });
    fixture = TestBed.createComponent(ChangePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
