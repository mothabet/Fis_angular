import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralIndicatorsComponent } from './Components/general-indicators/general-indicators.component';
import { SharedModule } from '../shared/shared.module';
import { OmanMapsComponent } from './Components/oman-maps/oman-maps.component';
import { ChangePercentageComponent } from './Components/change-percentage/change-percentage.component';
import { LaunchYearComponent } from './Components/launch-year/launch-year.component';
import { OmanMapSettingComponent } from './Components/oman-map-setting/oman-map-setting.component';



@NgModule({
  declarations: [
    GeneralIndicatorsComponent,
    OmanMapsComponent,
    ChangePercentageComponent,
    LaunchYearComponent,
    OmanMapSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeSettingModule { }
