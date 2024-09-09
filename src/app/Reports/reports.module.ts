import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './Components/reports/reports.component';
import { SharedModule } from '../shared/shared.module';
import { ReportContentsComponent } from './Components/report-contents/report-contents.component';



@NgModule({
  declarations: [
    ReportsComponent,
    ReportContentsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class ReportsModule { }
