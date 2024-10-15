import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAuthHomeComponent } from './settings-auth-home.component';

describe('SettingsAuthHomeComponent', () => {
  let component: SettingsAuthHomeComponent;
  let fixture: ComponentFixture<SettingsAuthHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsAuthHomeComponent]
    });
    fixture = TestBed.createComponent(SettingsAuthHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
