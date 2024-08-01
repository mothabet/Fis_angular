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
import { LogoutGuard } from './Guard/logout.guard';
import { LoginGuard } from './Guard/login.guard';
import { FormsComponent } from './Forms/Components/forms/forms.component';
import { FormDetailsComponent } from './Forms/Components/form-details/form-details.component';
import { TableWithPeriodComponent } from './Forms/Components/table-with-period/table-with-period.component';

const routes: Routes = [
  { path: 'PeriodTable/:formId/:tableId', component: TableWithPeriodComponent, canActivate: [LoginGuard] },
  { path: 'FormDetails/:id', component: FormDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Forms', component: FormsComponent, canActivate: [LoginGuard] },
  { path: 'Companies', component: CompaniesHomeComponent, canActivate: [LoginGuard] },
  { path: 'Companies-Details', component: CompaniesDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Researcher', component: ResearcherHomeComponent , canActivate: [LoginGuard]},
  { path: 'Researcher-Details', component: ResearcherDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Auditing-Rules', component: AuditingRulesHomeComponent, canActivate: [LoginGuard] },
  { path: 'Codes', component: CodeHomeComponent, canActivate: [LoginGuard] },
  { path: 'Login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'Home', component: HomeComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: 'Login', pathMatch: 'full' }, // Redirect to Home if no specific path is provided
  { path: '**', redirectTo: 'Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
