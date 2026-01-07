import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewBookComponent } from '../new-book/new-book.component';
import { UserService } from '../../services/user.service';
import {MatTooltipModule} from '@angular/material/tooltip';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    RouterModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public dialog = inject(MatDialog);
  user = inject(UserService);
  books: any = [];
  route = inject(Router);

  ngOnInit() {
    this.getbooks();
  }

  newBook(){    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.disableClose = true;
    const ref = this.dialog.open(NewBookComponent, dialogConfig);
    ref.componentInstance.emitter.subscribe(() => {
      this.getbooks();
    })
  }

  getbooks(){
    const {username,password} = this.user.retrieveCredentials();
    this.user.getUsers().subscribe({
      next: (res) => {
        res.forEach(user => {
          if(user.username === username && user.password === password){
            this.books = user.books;
            console.log("books",this.books);
          }
        })
      },
      error: (err) => {
        console.log("Error fetching users:", err);
      }
    })
  }

  viewBook(book: any) {
    console.log("book", book);
    this.route.navigate(['/viewBook'], {queryParams: {book: book.booktitle}});
  }

}
