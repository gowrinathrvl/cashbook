import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalProperties } from '../../shared/globalProperties';


@Component({
  selector: 'app-edit-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCalendar
],
  templateUrl: './edit-transactions.component.html',
  styleUrl: './edit-transactions.component.css',
  providers: [DatePipe]
})
export class EditTransactionsComponent implements OnInit {

  transactionData : any ={};
  bookname : any;
  userId : any;
  editForm : any= FormGroup;
  formBuilder = inject(FormBuilder);
  datePipe = inject(DatePipe);
  userService = inject(UserService);
  toaster = inject(ToastrService);
  dailogRef = inject(MatDialogRef<EditTransactionsComponent>);
  emitter = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {
    console.log("🚀 ~ EditTransactionsComponent ~ constructor ~ dialogData:", dialogData)
    this.transactionData = dialogData.data;
    this.bookname = dialogData.bookname;
    this.userId = dialogData.userId;
  }

  ngOnInit(): void {
    console.log("🚀 ~ EditTransactionsComponent ~ ngOnInit ~ this.transactionData:", this.transactionData);
    //convert date to string to object
    const dateParts = this.transactionData.date.split('/'); //['10', '8', '2023']
    const formattedDate = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
    //creating the form
    this.editForm = this.formBuilder.group({
      date: [new Date(), Validators.required],
      time: [new Date(), Validators.required],
      description: ['', Validators.required],
      amount: [0, Validators.required]

    })
    this.editForm.patchValue({
      date: formattedDate,
      time: this.transactionData.time,
      description: this.transactionData.description,
      amount: this.transactionData.amount
    })
  }

  
updateTransAction(){
  const formdata = this.editForm.value;
  const newDate = this.datePipe.transform(formdata.date, 'MM/dd/yyyy');
  const Data = {
    date: newDate,
    time: formdata.time,
    description: formdata.description,
    amount: formdata.amount
  }
  //check
  if(this.transactionData.type === 'cashIn') {
    this.userService.updateCashInEntry(this.userId, this.bookname, Data).subscribe({
      next: (res) => {
        this.toaster.success('Transaction updated successfully', 'Success', GlobalProperties.toastrconfig);
        this.dailogRef.close();
        this.emitter.emit();
      }
    })
  }

  if(this.transactionData.type === 'cashOut') {
    this.userService.updateCashOutEntry(this.userId, this.bookname, Data).subscribe({
      next: (res) => {
        this.toaster.success('Transaction updated successfully', 'Success', GlobalProperties.toastrconfig);
        this.dailogRef.close();
        this.emitter.emit();
      }
      })
  }

}


}
