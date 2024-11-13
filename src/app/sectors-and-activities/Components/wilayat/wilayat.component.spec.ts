import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilayatComponent } from './wilayat.component';

describe('WilayatComponent', () => {
  let component: WilayatComponent;
  let fixture: ComponentFixture<WilayatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WilayatComponent]
    });
    fixture = TestBed.createComponent(WilayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
