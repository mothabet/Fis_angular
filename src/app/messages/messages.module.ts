import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomemessagesComponent } from './components/homemessages/homemessages.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomemessagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MessagesModule { }
