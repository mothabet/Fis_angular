import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './Components/forms/forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormDetailsComponent } from './Components/form-details/form-details.component';
import { TableWithPeriodComponent } from './Components/table-with-period/table-with-period.component';
import { TransTableComponent } from './Components/trans-table/trans-table.component';
import { TableWithoutTransComponent } from './Components/table-without-trans/table-without-trans.component';
import { TwoYearsWithPartsComponent } from './Components/two-years-with-parts/two-years-with-parts.component';
import { OneYearWithPartsComponent } from './Components/one-year-with-parts/one-year-with-parts.component';
import { QuarterFormCoverComponent } from './Components/quarter-form-cover/quarter-form-cover.component';
import { QuarterTableComponent } from './Components/quarter-table/quarter-table.component';
import { WorkDataComponent } from './Components/work-data/work-data.component';
import { CertificationComponent } from './Components/certification/certification.component';
import { PrevFormComponent } from './Components/prev-form/prev-form.component';
import { TablePercentageWithoutTransComponent } from './Components/table-percentage-without-trans/table-percentage-without-trans.component';



@NgModule({
  declarations: [
    FormsComponent,
    FormDetailsComponent,
    TableWithPeriodComponent,
    TransTableComponent,
    TableWithoutTransComponent,
    TwoYearsWithPartsComponent,
    OneYearWithPartsComponent,
    QuarterFormCoverComponent,
    QuarterTableComponent,
    WorkDataComponent,
    CertificationComponent,
    PrevFormComponent,
    TablePercentageWithoutTransComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class FromsModule { }
