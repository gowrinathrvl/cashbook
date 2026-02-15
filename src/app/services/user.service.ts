import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncriptionService } from './encription.service';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url = environment.apiUrl; //localhost:3000
  private http = inject(HttpClient);
  private _encriptionService = inject(EncriptionService);

  constructor() { }

  userRegister(data: any) {
    return this.http.post<any>(`${this.url}/users`, data);
  }

  storeCredentials(username: string, password: string) {
    const combinedCredentials = `${username}:${password}`;
    const encrytedData = this._encriptionService.encrypt(combinedCredentials);
    sessionStorage.setItem('userCredentials', encrytedData);
  }

  retrieveCredentials(): { username: string, password: string } | null {
    const encryptedData = sessionStorage.getItem('userCredentials');
    if (encryptedData) {
      const decryptedData = this._encriptionService.decrypt(encryptedData);
      const [username, password] = decryptedData.split(':');
      return { username, password };
    }
    return null;
  }

  getUsers() {
    return this.http.get<any>(`${this.url}/users`);
  }


  cashInEntry( userId:any, bookName:any, data: any):Observable<any> {
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    switchMap((user : any) => {
      //Find the book and update the cashInEntries
      const updatedBook = user.books.map((book:any) => {
        if(book.booktitle === bookName) {
          //add the new entry to cashInEntries
          const updatedBook = {
            ...book,
            cashInEntries: [...(book.cashInEntries || []), data]
          }
          //calculate the new cashInTotal
          const cashInTotal = (updatedBook.cashInEntries || [])
                                  .reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);

          return {
            ...updatedBook,
            cashInTotal: cashInTotal
          }
        }
        return book
      })
      //update the user with updated book
      return this.http.patch(`${this.url}/users/${userId}`, {books: updatedBook});
    })
  )
  }

  cashOutEntry( userId:any, bookName:any, data:any):Observable<any> {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      switchMap((user:any)=> {
        //Find the book and update the cashOutEntries
        const updatedBook = user.books.map((book:any) => {
          if(book.booktitle === bookName) {
            //add the new entry to cashOutEntries
            const updatedBook = {
              ...book,
              cashOutEntries: [...(book.cashOutEntries || []), data]
            }
            //calculate the new cashOutTotal
            const cashOutTotal = (updatedBook.cashOutEntries || [])
                                    .reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);

            return {
              ...updatedBook,
              cashOutTotal: cashOutTotal
            }
          }
          return book
        })
        //update the user with updated book
        return this.http.patch(`${this.url}/users/${userId}`, {books: updatedBook});
      })
    )
  }


  entriesTable(userId: any, bookName: any) {
    return this.http.get(`${this.url}/users/${userId}`).pipe(
      map((user:any)=> {
        const book = user.books.find((b:any) => b.booktitle === bookName);
        if(book){
          const cashInEntries = book.cashInEntries || [];
          const cashOutEntries = book.cashOutEntries || [];
          const combinedEntires = [...cashInEntries, ...cashOutEntries];
          combinedEntires.sort((a:any, b:any) => {
            const dateTimeA = this.parseDateTime(a.date, a.time);
            const dateTimeB = this.parseDateTime(b.date, b.time);
            return dateTimeB.getTime() - dateTimeA.getTime();
          })
          //Add a type property to each entry
          return combinedEntires.map(entry => ({
            ...entry,
            type: cashInEntries.includes(entry) ? 'cashIn' : 'cashOut'
          }))
        }
        return  []

      })
    );
  }

  parseDateTime(date: string, time: string): Date {
    return new Date(`${date} ${time}`);
  }





}