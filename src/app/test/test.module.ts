import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TestComponent } from './component/test/test.component';



@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TestModule { }
