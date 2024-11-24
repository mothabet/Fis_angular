import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyHomeComponent } from './components/company-home/company-home.component';
import { HomeMapComponent } from './components/home-map/home-map.component';



@NgModule({
  declarations: [
    HomeComponent,
    CompanyHomeComponent,
    HomeMapComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule { }
