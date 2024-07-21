import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { CompaniesHomeComponent } from './companies/components/companies-home/companies-home.component';
import { ResearcherHomeComponent } from './researcher/components/researcher-home/researcher-home.component';
import { ResearcherDetailsComponent } from './researcher/components/researcher-details/researcher-details.component';
import { CompaniesDetailsComponent } from './companies/components/companies-details/companies-details.component';
import { AuditingRulesHomeComponent } from './auditing-rules/components/auditing-rules-home/auditing-rules-home.component';

const routes: Routes = [
  { path: 'Companies', component: CompaniesHomeComponent },
  { path: 'Companies-Details', component: CompaniesDetailsComponent },
  { path: 'Researcher', component: ResearcherHomeComponent },
  { path: 'Researcher-Details', component: ResearcherDetailsComponent },
  { path: 'Auditing-Rules', component: AuditingRulesHomeComponent },
  { path: 'Home', component: HomeComponent },
  { path: '', redirectTo: 'Home', pathMatch: 'full' }, // Redirect to Home if no specific path is provided
  { path: '**', redirectTo: 'Home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
