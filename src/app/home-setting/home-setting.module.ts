import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralIndicatorsComponent } from './Components/general-indicators/general-indicators.component';
import { SharedModule } from '../shared/shared.module';
import { OmanMapsComponent } from './Components/oman-maps/oman-maps.component';
import { ChangePercentageComponent } from './Components/change-percentage/change-percentage.component';



@NgModule({
  declarations: [
    GeneralIndicatorsComponent,
    OmanMapsComponent,
    ChangePercentageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeSettingModule { }
