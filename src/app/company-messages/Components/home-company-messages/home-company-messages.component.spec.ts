import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompanyMessagesComponent } from './home-company-messages.component';

describe('HomeCompanyMessagesComponent', () => {
  let component: HomeCompanyMessagesComponent;
  let fixture: ComponentFixture<HomeCompanyMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeCompanyMessagesComponent]
    });
    fixture = TestBed.createComponent(HomeCompanyMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
