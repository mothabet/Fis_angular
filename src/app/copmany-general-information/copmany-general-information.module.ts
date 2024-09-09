import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopmanyGeneralInformationHomeComponent } from './components/copmany-general-information-home/copmany-general-information-home.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CopmanyGeneralInformationHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CopmanyGeneralInformationModule { }
