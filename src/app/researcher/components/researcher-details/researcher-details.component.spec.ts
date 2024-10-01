import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherDetailsComponent } from './researcher-details.component';

describe('ResearcherDetailsComponent', () => {
  let component: ResearcherDetailsComponent;
  let fixture: ComponentFixture<ResearcherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResearcherDetailsComponent]
    });
    fixture = TestBed.createComponent(ResearcherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
