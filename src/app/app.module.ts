import { NgModule } from '@angular/core';
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
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    HomeModule,
    CompaniesModule,
    FromsModule,
    ResearcherModule,
    AuditingRulesModule,
    AuthModule,
    CodeModule,
    MessagesModule,
    CompanyMessagesModule,
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
export class AppModule { }
