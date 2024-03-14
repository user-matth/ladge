import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-admin-base',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './admin-base.component.html',
  styleUrls: ['./admin-base.component.css']
})
export class AdminBaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
