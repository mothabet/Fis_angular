import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevFormComponent } from './prev-form.component';

describe('PrevFormComponent', () => {
  let component: PrevFormComponent;
  let fixture: ComponentFixture<PrevFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrevFormComponent]
    });
    fixture = TestBed.createComponent(PrevFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
