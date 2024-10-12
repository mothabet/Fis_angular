import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TopScreenComponent } from './components/top-screen/top-screen.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NavigateTablesTypesComponent } from './components/navigate-tables-types/navigate-tables-types.component';
import { NgxEditorModule } from 'ngx-editor';
import { SharedTransTableComponent } from './components/Tables/shared-trans-table/shared-trans-table.component';
import { SharedTableWithoutTransComponent } from './components/Tables/shared-table-without-trans/shared-table-without-trans.component';
import { SharedTableWithPeriodComponent } from './components/Tables/shared-table-with-period/shared-table-with-period.component';
import { SharedQuarterTableComponent } from './components/Tables/shared-quarter-table/shared-quarter-table.component';
import { SharedWorkDataComponent } from './components/Tables/shared-work-data/shared-work-data.component';
import { SharedOneYearWithPartsComponent } from './components/Tables/shared-one-year-with-parts/shared-one-year-with-parts.component';
import { SharedFormCoverComponent } from './components/Tables/shared-form-cover/shared-form-cover.component';
import { SharedTwoYearsWithPartsComponent } from './components/Tables/shared-two-years-with-parts/shared-two-years-with-parts.component';
import { SharedQuarterFormCoverComponent } from './components/Tables/shared-quarter-form-cover/shared-quarter-form-cover.component';
import { SharedCertificationComponent } from './components/Tables/shared-certification/shared-certification.component';
import { SharedTablePercentageWithoutTransComponent } from './components/Tables/shared-table-percentage-without-trans/shared-table-percentage-without-trans.component';
import { TableWithTransRepComponent } from './components/ReportTables/table-with-trans-rep/table-with-trans-rep.component';
import { TableWithoutTransRepComponent } from './components/ReportTables/table-without-trans-rep/table-without-trans-rep.component';
import { OneYearWithPartsRepComponent } from './components/ReportTables/one-year-with-parts-rep/one-year-with-parts-rep.component';
import { TwoYearsWithPartsRepComponent } from './components/ReportTables/two-years-with-parts-rep/two-years-with-parts-rep.component';
import { TableWithPeriodsRepComponent } from './components/ReportTables/table-with-periods-rep/table-with-periods-rep.component';

@NgModule({
  declarations: [
    SidebarComponent,
    TopScreenComponent,
    LoaderComponent,
    PaginationComponent,
    NavigateTablesTypesComponent,
    SharedTwoYearsWithPartsComponent,
    SharedTransTableComponent,
    SharedTableWithoutTransComponent,
    SharedTableWithPeriodComponent,
    SharedQuarterTableComponent,
    SharedWorkDataComponent,
    SharedOneYearWithPartsComponent,
    SharedFormCoverComponent,
    SharedQuarterFormCoverComponent,
    SharedCertificationComponent,
    SharedTablePercentageWithoutTransComponent,
    TableWithTransRepComponent,
    TableWithTransRepComponent,
    TableWithoutTransRepComponent,
    OneYearWithPartsRepComponent,
    TwoYearsWithPartsRepComponent,
    TableWithPeriodsRepComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxEditorModule,
    FormsModule
  ],
  exports: [
    SharedFormCoverComponent,
    SharedTransTableComponent,
    SharedTableWithoutTransComponent,
    SharedTablePercentageWithoutTransComponent,
    SharedTableWithPeriodComponent,
    SharedQuarterTableComponent,
    SharedWorkDataComponent,
    SharedOneYearWithPartsComponent,
    SharedTwoYearsWithPartsComponent,
    NavigateTablesTypesComponent,
    SharedQuarterFormCoverComponent,
    SidebarComponent,
    TopScreenComponent,
    LoaderComponent,
    PaginationComponent,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxEditorModule,
    SharedCertificationComponent,
    TableWithTransRepComponent,
    TableWithoutTransRepComponent,
    OneYearWithPartsRepComponent,
    TwoYearsWithPartsRepComponent,
    TableWithPeriodsRepComponent
  ]
})
export class SharedModule { }
