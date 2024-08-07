import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomemessagesComponent } from './components/homemessages/homemessages.component';
import { SharedModule } from '../shared/shared.module';
import { TabelMessagesComponent } from './components/tabel-messages/tabel-messages.component';



@NgModule({
  declarations: [
    HomemessagesComponent,
    TabelMessagesComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    TabelMessagesComponent
  ]
})
export class MessagesModule { }
