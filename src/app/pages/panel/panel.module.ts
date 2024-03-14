import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelRoutingModule } from './panel-routing.module';
import { PanelBaseComponent } from './components/panel-base/panel-base.component';

@NgModule({
  imports: [
    CommonModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
