import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './Components/forms/forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormDetailsComponent } from './Components/form-details/form-details.component';



@NgModule({
  declarations: [
    FormsComponent,
    FormDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class FromsModule { }
