import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PermissionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PermissionsModule { }
