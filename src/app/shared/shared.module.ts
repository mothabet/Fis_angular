import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TopScreenComponent } from './components/top-screen/top-screen.component';

@NgModule({
  declarations: [
    SidebarComponent,
    TopScreenComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    SidebarComponent,
    TopScreenComponent,
    AppRoutingModule, 
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class SharedModule { }
