import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelRoutingModule } from './panel-routing.module';
import { PanelBaseComponent } from './components/panel-base/panel-base.component';
import { IbgeService } from '../../services/ibge/ibge.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    PanelRoutingModule,
    HttpClientModule
  ],
  providers: [
    IbgeService
  ],
})
export class PanelModule { }
