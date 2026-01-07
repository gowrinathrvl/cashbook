import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { GlobalProperties } from '../shared/globalProperties';

@Injectable({
  providedIn: 'root'
})
export class EncriptionService {
  private _secretKey: string = GlobalProperties.secret_key;

  constructor() { }

  encrypt(data: string): string {
   return CryptoJS.AES.encrypt(data, this._secretKey).toString();
  }

  decrypt(ciphertext: string): string {
   const bytes = CryptoJS.AES.decrypt(ciphertext, this._secretKey);
   return bytes.toString(CryptoJS.enc.Utf8);
  }
}
