import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataMaximizeComponent } from './Components/data-maximize/data-maximize.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DataMaximizeDetailsComponent } from './Components/data-maximize-details/data-maximize-details.component';



@NgModule({
  declarations: [
    DataMaximizeComponent,
    DataMaximizeDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class DataMaximizeModule { }
