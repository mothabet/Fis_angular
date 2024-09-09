import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { CompaniesModule } from './companies/companies.module';
import { ResearcherModule } from './researcher/researcher.module';
import { AuditingRulesModule } from './auditing-rules/auditing-rules.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthModule } from './auth/auth.module';
import { CodeModule } from './code/code.module';
import { FromsModule } from './Forms/froms.module';
import { MessagesModule } from './messages/messages.module';
import { CompanyMessagesModule } from './company-messages/company-messages.module';
import { CopmanyGeneralInformationModule } from './copmany-general-information/copmany-general-information.module';
import { ReportsComponent } from './Reports/Components/reports/reports.component';
import { SectorsAndActivitiesModule } from './sectors-and-activities/sectors-and-activities.module';

@NgModule({
  declarations: [
    AppComponent,
    ReportsComponent,
  ],
  imports: [
    SharedModule,
    HomeModule,
    CompaniesModule,
    SectorsAndActivitiesModule,
    FromsModule,
    ResearcherModule,
    AuditingRulesModule,
    AuthModule,
    CodeModule,
    MessagesModule,
    CompanyMessagesModule,
    CopmanyGeneralInformationModule,
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-left',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
