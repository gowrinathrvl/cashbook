import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ToastrService } from 'ngx-toastr';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';




@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [
  CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule
],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  providers: [DatePipe],
  preserveWhitespaces: true,
})
export class ViewBookComponent implements OnInit{
  activatedRoute = inject(ActivatedRoute);
  bookname: any = '';
  searchKey: string = '';
  isDrawerOpen = false;
  addForm: any = FormGroup;
  userId:any;
  entryCode = 0;
  cashInMoney:number;
  cashOutMoney:number;
  title: any;

  
  
  fb =inject(FormBuilder);
  datePipe = inject(DatePipe);
  router = inject(Router);
  toster = inject(ToastrService)

  constructor() { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.bookname = params['book'];
       });
}

  ngOnInit() {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
    this.addForm = this.fb.group({
      date : [new Date(), Validators.required],
      time : [currentTime, Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required],
    });
  }


goBack(){
this.router.navigate(['/dashboard']);
}

toggleDrawerForCashIn(){
  this.isDrawerOpen = !this.isDrawerOpen;
  this.title = "Add entry for Cash In";
  this.entryCode = 1;
}
toggleDrawerForCashOut(){
  this.isDrawerOpen = !this.isDrawerOpen;
  this.title = "Add entry for Cash Out";
  this.entryCode = 2;
}
toggleDrawer(){
  this.isDrawerOpen = !this.isDrawerOpen;
}
addCashInEntry(){
  console.log("test");
}
addCashOutEntry(){}

}
