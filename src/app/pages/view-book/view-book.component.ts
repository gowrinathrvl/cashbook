import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { UserService } from '../../services/user.service';
import { GlobalProperties } from '../../shared/globalProperties';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditTransactionsComponent } from '../edit-transactions/edit-transactions.component';




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
    NgxMaterialTimepickerModule,
    MatTableModule,
    MatPaginatorModule,
    RouterLink
],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  providers: [DatePipe],
  preserveWhitespaces: true,
})
export class ViewBookComponent implements OnInit, AfterViewInit{
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
  entries: any;
  displayedColumns : string [] = ['date', 'time', 'description','amount', 'actions'];
  dialog = inject(MatDialog);
  
  
  fb =inject(FormBuilder);
  userservice = inject(UserService);
  datePipe = inject(DatePipe);
  router = inject(Router);
  toster = inject(ToastrService)

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.getTotals();
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
  this.resetForm();
}

  async save() {
    const formData = this.addForm.value;
    const transactionDate = this.datePipe.transform(formData.date, 'MM/dd/YYY');
    const data = {
      date: transactionDate,
      time: formData.time,
      amount: formData.amount,
      description: formData.description
    }
    let userDetails = this.userservice.retrieveCredentials();
    console.log("🚀 ~ ViewBookComponent ~ save ~ userDetails:", userDetails)
    await this.userservice.getUsers().subscribe({
      next: (res: any) => {
        console.log("🚀 ~ ViewBookComponent ~ save ~ res:", res)
        res.find(obj => {
          if (obj.username === userDetails?.username && obj.password === userDetails?.password) {
            this.userId = obj.id;
            console.log("🚀 ~ ViewBookComponent ~ save ~ this.userId:", this.userId)
          }
        })
        if (this.entryCode == 1) {
          this.userservice.cashInEntry(this.userId, this.bookname, data).subscribe({
            next: (res: any) => {
              console.log("🚀 ~ ViewBookComponent ~ save ~ res:", res)
              this.toster.success('Entry added successfully', 'Success', GlobalProperties.toastrconfig);
              this.getTotals();
              this.resetForm();
              this.toggleDrawer();
              this.getEntriesTable();
            }
          })
        }
        if (this.entryCode == 2) {
          this.userservice.cashOutEntry(this.userId, this.bookname, data).subscribe({
            next: (res: any) => {
              this.toster.success('Entry added successfully', 'Success', GlobalProperties.toastrconfig);
              this.getTotals();
              this.resetForm();
              this.toggleDrawer();
              this.getEntriesTable();
            }
          })
        }
      },
      error: (err: any) => {
        this.toster.error('Failed to add entry', 'Failed', GlobalProperties.toastrconfig);
      }

    }
    )
  }

resetForm(){
  const initialTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
  this.addForm.setValue({
    date: new Date(),
    time: initialTime,
    amount: 0,
    description: ''
  }); 
}


getTotals(){
  console.log("getting totals for book:", this.bookname);
  let userDetails = this.userservice.retrieveCredentials();
  this.userservice.getUsers().subscribe({
    next: (res:any) =>{
      res.find((obj:any) => {
        if(obj.username === userDetails?.username && obj.password === userDetails?.password){
          this.userId = obj.id;

          obj.books.forEach((book:any) => {
            if(book.booktitle === this.bookname){
              console.log("book details", book, this.bookname);
              this.cashInMoney = book.cashInTotal || 0;
              this.cashOutMoney = book.cashOutTotal || 0;
            }
          })
        }
      })
    }
  })
}

getEntriesTable(){
  let userDetails = this.userservice.retrieveCredentials();
  this.userservice.getUsers().subscribe({
    next: (res:any) =>{
      res.find((obj:any) => {
        if(obj.username === userDetails?.username && obj.password === userDetails?.password){
          this.userId = obj.id;
        }
      })
      this.userservice.entriesTable(this.userId, this.bookname).subscribe({
        next: (entries:any) =>{
          this.entries = new MatTableDataSource(entries);
          this.entries.paginator = this.paginator;

        }
      })

}
  })
}

get hasEntries(): boolean {
  return this.entries?.data.length > 0; 
}

ngAfterViewInit(): void {
    this.getEntriesTable();
}

applyFilter( value: any){
  this.entries.filter = value.trim().toLowerCase(); 
}

onSearchClear(){
  this.searchKey = '';
  this.applyFilter(this.searchKey);
}

onEdit(data: any){
  console.log("🚀 ~ ViewBookComponent ~ onEdit ~ element:", data);
  const dailogConfig = new MatDialogConfig();
  dailogConfig.width = '400px';
  dailogConfig.autoFocus = true;
  dailogConfig.disableClose = true;
  dailogConfig.data = {
    data: data,
    userId:this.userId,
    bookname: this.bookname
  }
  const dialogRef = this.dialog.open(EditTransactionsComponent, dailogConfig);
  dialogRef.componentInstance.emitter.subscribe({
    next: (res) => {
      this.getEntriesTable();
      this.getTotals();
    }
  })
}

onDelete(data:any){
  this.userservice.deleteEntry(this.userId, this.bookname, data.type, data.date, data.time).subscribe({
    next: (res) => {
      this.toster.success('Transaction deleted successfully', 'Success', GlobalProperties.toastrconfig);
      this.getEntriesTable();
      this.getTotals();
    },
    error: (err) => {
      this.toster.error('Failed to delete entry', 'Failed', GlobalProperties.toastrconfig);
    }
  })

}

}
