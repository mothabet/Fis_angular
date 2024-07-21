import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { CompaniesModule } from './companies/companies.module';
import { ResearcherModule } from './researcher/researcher.module';
import { AuditingRulesModule } from './auditing-rules/auditing-rules.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    HomeModule,
    CompaniesModule,
    ResearcherModule,
    AuditingRulesModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
