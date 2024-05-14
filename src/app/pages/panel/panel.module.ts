import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelRoutingModule } from './panel-routing.module';
import { PanelBaseComponent } from './components/panel-base/panel-base.component';
import { IbgeService } from '../../services/ibge/ibge.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FilesComponent } from './components/files/files.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    IbgeService
  ],
})
export class PanelModule { }
