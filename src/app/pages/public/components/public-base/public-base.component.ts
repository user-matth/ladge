import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-base',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './public-base.component.html',
  styleUrls: ['./public-base.component.css']
})
export class PublicBaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
