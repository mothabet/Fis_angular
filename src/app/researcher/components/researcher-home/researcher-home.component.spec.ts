import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherHomeComponent } from './researcher-home.component';

describe('ResearcherHomeComponent', () => {
  let component: ResearcherHomeComponent;
  let fixture: ComponentFixture<ResearcherHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResearcherHomeComponent]
    });
    fixture = TestBed.createComponent(ResearcherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
