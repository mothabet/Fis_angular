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



@NgModule({
  declarations: [
    FormsComponent,
    FormDetailsComponent,
    TableWithPeriodComponent,
    TransTableComponent,
    TableWithoutTransComponent,
    TwoYearsWithPartsComponent,
    OneYearWithPartsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class FromsModule { }