import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesHomeComponent } from './companies-home.component';

describe('CompaniesHomeComponent', () => {
  let component: CompaniesHomeComponent;
  let fixture: ComponentFixture<CompaniesHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompaniesHomeComponent]
    });
    fixture = TestBed.createComponent(CompaniesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
