import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelHomeComponent } from './components/panel-home/panel-home.component';

const routes: Routes = [
  { path: '', component: PanelHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
