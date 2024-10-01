import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeHomeComponent } from './code-home.component';

describe('CodeHomeComponent', () => {
  let component: CodeHomeComponent;
  let fixture: ComponentFixture<CodeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeHomeComponent]
    });
    fixture = TestBed.createComponent(CodeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
