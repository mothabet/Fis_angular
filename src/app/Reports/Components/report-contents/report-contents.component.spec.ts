import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContentsComponent } from './report-contents.component';

describe('ReportContentsComponent', () => {
  let component: ReportContentsComponent;
  let fixture: ComponentFixture<ReportContentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportContentsComponent]
    });
    fixture = TestBed.createComponent(ReportContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
