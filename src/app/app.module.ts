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
import { SectorsAndActivitiesModule } from './sectors-and-activities/sectors-and-activities.module';
import { ReportsModule } from './Reports/reports.module';
import { SettingsAuthModule } from './settings-auth/settings-auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { HomeSettingModule } from './home-setting/home-setting.module';
import { DataMaximizeModule } from './data-maximize/data-maximize.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
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
    ReportsModule,
    MessagesModule,
    CompanyMessagesModule,
    SettingsAuthModule,
    PermissionsModule,
    CopmanyGeneralInformationModule,
    BrowserModule,
    HomeSettingModule,
    ProfileModule,
    NotificationsModule,
    AppRoutingModule,
    DataMaximizeModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-left',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
