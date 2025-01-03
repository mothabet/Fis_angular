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
import { TransTableComponent } from './Forms/Components/trans-table/trans-table.component';
import { TableWithoutTransComponent } from './Forms/Components/table-without-trans/table-without-trans.component';
import { OneYearWithPartsComponent } from './Forms/Components/one-year-with-parts/one-year-with-parts.component';
import { TwoYearsWithPartsComponent } from './Forms/Components/two-years-with-parts/two-years-with-parts.component';
import { QuarterFormCoverComponent } from './Forms/Components/quarter-form-cover/quarter-form-cover.component';
import { QuarterTableComponent } from './Forms/Components/quarter-table/quarter-table.component';
import { HomemessagesComponent } from './messages/components/homemessages/homemessages.component';
import { HomeCompanyMessagesComponent } from './company-messages/Components/home-company-messages/home-company-messages.component';
import { WorkDataComponent } from './Forms/Components/work-data/work-data.component';
import { CertificationComponent } from './Forms/Components/certification/certification.component';
import { CompanyHomeComponent } from './home/components/company-home/company-home.component';
import { PrevFormComponent } from './Forms/Components/prev-form/prev-form.component';
import { CopmanyGeneralInformationHomeComponent } from './copmany-general-information/components/copmany-general-information-home/copmany-general-information-home.component';
import { ReportsComponent } from './Reports/Components/reports/reports.component';
import { ReportContentsComponent } from './Reports/Components/report-contents/report-contents.component';
import { SectorsComponent } from './sectors-and-activities/Components/sectors/sectors.component';
import { ActivitiesComponent } from './sectors-and-activities/Components/activities/activities.component';
import { SubActivitiesComponent } from './sectors-and-activities/Components/sub-activities/sub-activities.component';
import { CountriesComponent } from './sectors-and-activities/Components/countries/countries.component';
import { CompanyResearcherHomeComponent } from './companies/components/company-researcher-home/company-researcher-home.component';
import { TablePercentageWithoutTransComponent } from './Forms/Components/table-percentage-without-trans/table-percentage-without-trans.component';
import { SettingsAuthHomeComponent } from './settings-auth/Components/settings-auth-home/settings-auth-home.component';
import { GroupComponent } from './sectors-and-activities/Components/group/group.component';
import { CategoryComponent } from './sectors-and-activities/Components/category/category.component';
import { SectionComponent } from './sectors-and-activities/Components/section/section.component';
import { OneYearWithPartsAndTotalComponent } from './Forms/Components/one-year-with-parts-and-total/one-year-with-parts-and-total.component';
import { GeneralIndicatorsComponent } from './home-setting/Components/general-indicators/general-indicators.component';
import { OmanMapsComponent } from './home-setting/Components/oman-maps/oman-maps.component';
import { GovernorateComponent } from './sectors-and-activities/Components/governorate/governorate.component';
import { WilayatComponent } from './sectors-and-activities/Components/wilayat/wilayat.component';
import { HomeMapComponent } from './home/components/home-map/home-map.component';
import { ChangePercentageComponent } from './home-setting/Components/change-percentage/change-percentage.component';
import { AuditComponent } from './home/components/audit/audit.component';
import { DataMaximizeComponent } from './data-maximize/Components/data-maximize/data-maximize.component';
import { DataMaximizeDetailsComponent } from './data-maximize/Components/data-maximize-details/data-maximize-details.component';
import { LaunchYearComponent } from './home-setting/Components/launch-year/launch-year.component';
import { ProfileComponent } from './profile/Components/profile/profile.component';
import { NotificationsHomeComponent } from './notifications/Components/notifications-home/notifications-home.component';

const routes: Routes = [
  { path: 'Sections', component: SectionComponent, canActivate: [LoginGuard] },
  { path: 'Groups', component: GroupComponent, canActivate: [LoginGuard] },
  { path: 'Categories', component: CategoryComponent, canActivate: [LoginGuard] },
  { path: 'Sectors', component: SectorsComponent, canActivate: [LoginGuard] },
  { path: 'Activities', component: ActivitiesComponent, canActivate: [LoginGuard] },
  { path: 'SubActivities', component: SubActivitiesComponent, canActivate: [LoginGuard] },
  { path: 'Countries', component: CountriesComponent, canActivate: [LoginGuard] },
  { path: 'Governorates', component: GovernorateComponent, canActivate: [LoginGuard] },
  { path: 'Wilayat', component: WilayatComponent, canActivate: [LoginGuard] },
  { path: 'Certification/:formId/:companyId', component: CertificationComponent, canActivate: [LoginGuard] },
  { path: 'Reports', component: ReportsComponent, canActivate: [LoginGuard] },
  { path: 'ReportContents/:reportId', component: ReportContentsComponent, canActivate: [LoginGuard] },
  { path: 'WorkData/:formId/:companyId', component: WorkDataComponent, canActivate: [LoginGuard] },
  { path: 'QuarterTable/:formId/:tableId/:companyId', component: QuarterTableComponent, canActivate: [LoginGuard] },
  { path: 'QuarterFormCover/:formId/:type/:companyId', component: QuarterFormCoverComponent, canActivate: [LoginGuard] },
  { path: 'TransTable/:formId/:tableId/:companyId', component: TransTableComponent, canActivate: [LoginGuard] },
  { path: 'PeriodTable/:formId/:tableId/:companyId', component: TableWithPeriodComponent, canActivate: [LoginGuard] },
  { path: 'TableWithoutTrans/:formId/:tableId/:companyId', component: TableWithoutTransComponent, canActivate: [LoginGuard] },
  { path: 'TablePercentageWithoutTrans/:formId/:tableId/:companyId', component: TablePercentageWithoutTransComponent, canActivate: [LoginGuard] },
  { path: 'OneYearWithParts/:formId/:tableId/:companyId', component: OneYearWithPartsComponent, canActivate: [LoginGuard] },
  { path: 'OneYearWithPartsAndTotal/:formId/:tableId/:companyId', component: OneYearWithPartsAndTotalComponent, canActivate: [LoginGuard] },
  { path: 'TwoYearsWithParts/:formId/:tableId/:companyId', component: TwoYearsWithPartsComponent, canActivate: [LoginGuard] },
  { path: 'FormDetails/:formId/:type/:companyId', component: FormDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Forms', component: FormsComponent, canActivate: [LoginGuard] },
  { path: 'Companies', component: CompaniesHomeComponent, canActivate: [LoginGuard] },
  { path: 'Companies-Researcher/:researcherId', component: CompanyResearcherHomeComponent, canActivate: [LoginGuard] },
  { path: 'Companies-Details/:companyId', component: CompaniesDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Researcher', component: ResearcherHomeComponent , canActivate: [LoginGuard]},
  { path: 'Researcher-Details/:researcherId', component: ResearcherDetailsComponent, canActivate: [LoginGuard] },
  { path: 'Auditing-Rules', component: AuditingRulesHomeComponent, canActivate: [LoginGuard] },
  { path: 'Profile', component: ProfileComponent, canActivate: [LoginGuard] },
  { path: 'Codes', component: CodeHomeComponent, canActivate: [LoginGuard] },
  { path: 'Messages', component: HomemessagesComponent, canActivate: [LoginGuard] },
  { path: 'SettingsAuth', component: SettingsAuthHomeComponent, canActivate: [LoginGuard] },
  { path: 'CopmanyMessages/:companyId', component: HomeCompanyMessagesComponent, canActivate: [LoginGuard] },
  { path: 'CopmanyGeneralInformation/:companyId', component: CopmanyGeneralInformationHomeComponent, canActivate: [LoginGuard] },
  { path: 'Login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'Home', component: HomeComponent, canActivate: [LoginGuard] },
  { path: 'CompanyHome/:companyId', component: CompanyHomeComponent, canActivate: [LoginGuard] },
  { path: 'PrevForm', component: PrevFormComponent, canActivate: [LoginGuard] },
  { path: 'GeneralIndicators', component: GeneralIndicatorsComponent, canActivate: [LoginGuard] },
  { path: 'ChangePercentage', component: ChangePercentageComponent, canActivate: [LoginGuard] },
  { path: 'Audit', component: AuditComponent, canActivate: [LoginGuard] },
  { path: 'OmanMaps', component: OmanMapsComponent, canActivate: [LoginGuard] },
  { path: 'DataMaximize', component: DataMaximizeComponent, canActivate: [LoginGuard] },  { path: 'HomeMap', component: HomeMapComponent, canActivate: [LoginGuard] },
  { path: 'DataMaximizeDetails/:id', component: DataMaximizeDetailsComponent, canActivate: [LoginGuard] },
  { path: 'YearOfLaunch', component: LaunchYearComponent, canActivate: [LoginGuard] },
  { path: 'Notification', component: NotificationsHomeComponent, canActivate: [LoginGuard] },
  // { path: 'OmanMapSetting', component: OmanMapSettingComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: 'Login', pathMatch: 'full' }, // Redirect to Home if no specific path is provided
  { path: '**', redirectTo: 'Login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
