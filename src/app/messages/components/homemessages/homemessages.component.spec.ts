import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomemessagesComponent } from './homemessages.component';

describe('HomemessagesComponent', () => {
  let component: HomemessagesComponent;
  let fixture: ComponentFixture<HomemessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomemessagesComponent]
    });
    fixture = TestBed.createComponent(HomemessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
