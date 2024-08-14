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

@NgModule({
  declarations: [
    SidebarComponent,
    TopScreenComponent,
    LoaderComponent,
    PaginationComponent,
    NavigateTablesTypesComponent,
    SharedTwoYearsWithPartsComponent,
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
