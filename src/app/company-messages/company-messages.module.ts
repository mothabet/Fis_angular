import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCompanyMessagesComponent } from './Components/home-company-messages/home-company-messages.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeCompanyMessagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CompanyMessagesModule { }
