import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './Components/forms/forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormDetailsComponent } from './Components/form-details/form-details.component';
import { TableWithPeriodComponent } from './Components/table-with-period/table-with-period.component';



@NgModule({
  declarations: [
    FormsComponent,
    FormDetailsComponent,
    TableWithPeriodComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class FromsModule { }
