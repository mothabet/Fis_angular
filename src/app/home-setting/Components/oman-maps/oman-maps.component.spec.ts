import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmanMapsComponent } from './oman-maps.component';

describe('OmanMapsComponent', () => {
  let component: OmanMapsComponent;
  let fixture: ComponentFixture<OmanMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OmanMapsComponent]
    });
    fixture = TestBed.createComponent(OmanMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
