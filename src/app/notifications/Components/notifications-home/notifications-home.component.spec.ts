import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsHomeComponent } from './notifications-home.component';

describe('NotificationsHomeComponent', () => {
  let component: NotificationsHomeComponent;
  let fixture: ComponentFixture<NotificationsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsHomeComponent]
    });
    fixture = TestBed.createComponent(NotificationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
