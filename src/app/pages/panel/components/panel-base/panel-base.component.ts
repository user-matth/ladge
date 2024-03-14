import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel-base',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './panel-base.component.html',
  styleUrls: ['./panel-base.component.css']
})
export class PanelBaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
