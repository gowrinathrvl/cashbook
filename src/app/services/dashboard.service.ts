import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 url = environment.apiUrl;
 http = inject(HttpClient);

 addNewBook(userId: string, bookName: string){
  // return this.http.patch(`${this.url}/users/${userId}`, {books: {booktitle: bookName}});
  return this.http.get(`${this.url}/users/${userId}`)
  .pipe(
    switchMap((user: any) => {
      const updatedBooks = user.books ? [...user.books, {booktitle:bookName}] : [{booktitle:bookName}];
      return this.http.patch(`${this.url}/users/${userId}`, {books: updatedBooks});
    })
  );
 }

}
