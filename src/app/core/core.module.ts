import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ]
})
export class CoreModule { }
