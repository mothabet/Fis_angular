import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyResearcherHomeComponent } from './company-researcher-home.component';

describe('CompanyResearcherHomeComponent', () => {
  let component: CompanyResearcherHomeComponent;
  let fixture: ComponentFixture<CompanyResearcherHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyResearcherHomeComponent]
    });
    fixture = TestBed.createComponent(CompanyResearcherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
