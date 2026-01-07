import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from "@angular/material/icon";
import {  MatButtonModule } from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { GlobalProperties } from '../../shared/globalProperties';



@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule
],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css'
})
export class NewBookComponent implements OnInit {

  bookForm: any = FormGroup;
  fb = inject(FormBuilder);
  toaster = inject(ToastrService);
  dashboardService = inject(DashboardService);
  UserService = inject(UserService);
  dialogRef = inject(MatDialogRef<NewBookComponent>);
  emitter = new EventEmitter();
  userId: any;

  ngOnInit(){
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async addNewBook() {
    const formData = this.bookForm.value;
    const bookName = formData.name;
    let userDetails = this.UserService.retrieveCredentials();
    await this.UserService.getUsers().subscribe({
      next: (res: any) => {
        res.find(user => {
          if (user.username === userDetails?.username && user.password === userDetails?.password) {
            this.userId = user.id;
          }
        })
        this.dashboardService.addNewBook(this.userId, bookName).subscribe({
          next: (res) => {
            this.toaster.success(`${bookName} added successfully!`, 'Success', GlobalProperties.toastrconfig);
            this.dialogRef.close();
            this.emitter.emit();
          },
          error: (err) => {
            this.toaster.error('NO book was Added', 'Failed', GlobalProperties.toastrconfig);
          }
        })
      }
    })
  }


}
