import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsHomeComponent } from './Components/notifications-home/notifications-home.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NotificationsHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class NotificationsModule { }
