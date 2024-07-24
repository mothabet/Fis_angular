import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CodeHomeComponent } from './Components/code-home/code-home.component';



@NgModule({
  declarations: [
    CodeHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CodeModule { }
