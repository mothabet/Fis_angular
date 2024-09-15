import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesHomeComponent } from './components/companies-home/companies-home.component';
import { SharedModule } from '../shared/shared.module';
import { CompaniesDetailsComponent } from './components/companies-details/companies-details.component';
import { CompanyResearcherHomeComponent } from './components/company-researcher-home/company-researcher-home.component';

@NgModule({
  declarations: [
    CompaniesHomeComponent,
    CompaniesDetailsComponent,
    CompanyResearcherHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CompaniesModule { }
