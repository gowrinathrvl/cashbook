import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { UserService } from '../../services/user.service';
import {MatMenuModule} from '@angular/material/menu';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    RouterModule,
    MatMenuModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  preserveWhitespaces: true
})
export class HeaderComponent implements OnInit {

  private _user = inject(UserService);
  private _router = inject(Router);

  public username = signal('');
  
  ngOnInit(): void {
    this.getUsername();
  }
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.getUsername();
  }

  getUsername(){
    const user = sessionStorage.getItem('userCredentials');
    if(user){
      const userDetails = this._user.retrieveCredentials().username;
      this.username.update(user => user = userDetails);
    }
  }

  logOut(){
    sessionStorage.removeItem('userCredentials');
    this.username.update(user => user = '');
    this._router.navigate(['/']);

  }
}
