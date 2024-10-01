import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopScreenComponent } from './top-screen.component';

describe('TopScreenComponent', () => {
  let component: TopScreenComponent;
  let fixture: ComponentFixture<TopScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopScreenComponent]
    });
    fixture = TestBed.createComponent(TopScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
