import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopmanyGeneralInformationHomeComponent } from './copmany-general-information-home.component';

describe('CopmanyGeneralInformationHomeComponent', () => {
  let component: CopmanyGeneralInformationHomeComponent;
  let fixture: ComponentFixture<CopmanyGeneralInformationHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopmanyGeneralInformationHomeComponent]
    });
    fixture = TestBed.createComponent(CopmanyGeneralInformationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
