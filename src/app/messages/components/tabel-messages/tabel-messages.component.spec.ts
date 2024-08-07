import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelMessagesComponent } from './tabel-messages.component';

describe('TabelMessagesComponent', () => {
  let component: TabelMessagesComponent;
  let fixture: ComponentFixture<TabelMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabelMessagesComponent]
    });
    fixture = TestBed.createComponent(TabelMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
