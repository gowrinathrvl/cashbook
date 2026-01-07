import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncriptionService } from './encription.service';

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


}
