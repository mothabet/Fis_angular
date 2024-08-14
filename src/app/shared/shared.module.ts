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
import { SharedTwoYearsWithPartsComponent } from './components/Tables/shared-two-years-with-parts/shared-two-years-with-parts.component';
import { SharedTransTableComponent } from './components/Tables/shared-trans-table/shared-trans-table.component';
import { SharedTableWithoutTransComponent } from './components/Tables/shared-table-without-trans/shared-table-without-trans.component';
import { SharedTableWithPeriodComponent } from './components/Tables/shared-table-with-period/shared-table-with-period.component';
import { SharedQuarterTableComponent } from './components/Tables/shared-quarter-table/shared-quarter-table.component';
import { SharedWorkDataComponent } from './components/Tables/shared-work-data/shared-work-data.component';
import { SharedOneYearWithPartsComponent } from './components/Tables/shared-one-year-with-parts/shared-one-year-with-parts.component';

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
    SharedTransTableComponent,
    SharedTableWithoutTransComponent,
    SharedTableWithPeriodComponent,
    SharedQuarterTableComponent,
    SharedWorkDataComponent,
    SharedOneYearWithPartsComponent,
    SharedTwoYearsWithPartsComponent,
    NavigateTablesTypesComponent,
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
  ]
})
export class SharedModule { }
