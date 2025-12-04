import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink, RouterModule } from "@angular/router";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  preserveWhitespaces: true
})
export class HeaderComponent {

}
