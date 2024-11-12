import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralIndicatorsComponent } from './general-indicators.component';

describe('GeneralIndicatorsComponent', () => {
  let component: GeneralIndicatorsComponent;
  let fixture: ComponentFixture<GeneralIndicatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralIndicatorsComponent]
    });
    fixture = TestBed.createComponent(GeneralIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
