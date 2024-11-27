import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataMaximizeComponent } from './Components/data-maximize/data-maximize.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DataMaximizeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class DataMaximizeModule { }
