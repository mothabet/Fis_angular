import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearcherHomeComponent } from './components/researcher-home/researcher-home.component';
import { SharedModule } from '../shared/shared.module';
import { ResearcherDetailsComponent } from './components/researcher-details/researcher-details.component';



@NgModule({
  declarations: [
    ResearcherHomeComponent,
    ResearcherDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class ResearcherModule { }
