import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralIndicatorsComponent } from './Components/general-indicators/general-indicators.component';
import { SharedModule } from '../shared/shared.module';
import { OmanMapsComponent } from './Components/oman-maps/oman-maps.component';



@NgModule({
  declarations: [
    GeneralIndicatorsComponent,
    OmanMapsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeSettingModule { }
