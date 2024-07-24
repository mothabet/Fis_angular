import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { CompaniesHomeComponent } from './companies/components/companies-home/companies-home.component';
import { ResearcherHomeComponent } from './researcher/components/researcher-home/researcher-home.component';
import { ResearcherDetailsComponent } from './researcher/components/researcher-details/researcher-details.component';
import { CompaniesDetailsComponent } from './companies/components/companies-details/companies-details.component';
import { AuditingRulesHomeComponent } from './auditing-rules/components/auditing-rules-home/auditing-rules-home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { CodeHomeComponent } from './code/Components/code-home/code-home.component';

const routes: Routes = [
  { path: 'Companies', component: CompaniesHomeComponent },
  { path: 'Companies-Details', component: CompaniesDetailsComponent },
  { path: 'Researcher', component: ResearcherHomeComponent },
  { path: 'Researcher-Details', component: ResearcherDetailsComponent },
  { path: 'Auditing-Rules', component: AuditingRulesHomeComponent },
  { path: 'Codes', component: CodeHomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Home', component: HomeComponent },
  { path: '', redirectTo: 'Login', pathMatch: 'full' }, // Redirect to Home if no specific path is provided
  { path: '**', redirectTo: 'Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
