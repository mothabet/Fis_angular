import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorsComponent } from './Components/sectors/sectors.component';
import { ActivitiesComponent } from './Components/activities/activities.component';
import { SubActivitiesComponent } from './Components/sub-activities/sub-activities.component';
import { CountriesComponent } from './Components/countries/countries.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SectorsComponent,
    ActivitiesComponent,
    SubActivitiesComponent,
    CountriesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

  ]
})
export class SectorsAndActivitiesModule { }
