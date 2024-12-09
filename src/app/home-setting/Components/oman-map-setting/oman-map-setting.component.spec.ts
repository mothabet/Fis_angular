import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmanMapSettingComponent } from './oman-map-setting.component';

describe('OmanMapSettingComponent', () => {
  let component: OmanMapSettingComponent;
  let fixture: ComponentFixture<OmanMapSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OmanMapSettingComponent]
    });
    fixture = TestBed.createComponent(OmanMapSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
