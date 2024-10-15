import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsAuthHomeComponent } from './Components/settings-auth-home/settings-auth-home.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SettingsAuthHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingsAuthModule { }
